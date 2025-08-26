import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PrismaClient } from '@prisma/client';
import { body, param, validationResult } from 'express-validator';
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit uploads to 10 per 15 minutes
  message: "Too many upload attempts, please try again later."
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (reduced for better performance)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed!'));
    }
  }
});

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ROUTES

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Image upload route (protected)
app.post("/upload", 
  uploadLimiter,
  authenticateToken,
  upload.single("image"), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { path: filePath, filename } = req.file;

      // Process image and get metadata
      const metadata = await sharp(filePath)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(`uploads/optimized-${filename}`);

      // Remove original file and use optimized version
      await sharp(`uploads/optimized-${filename}`).toFile(filePath);
      
      const finalMetadata = await sharp(filePath).metadata();

      // Save to database
      const imageUrl = `${process.env.BASE_URL || `http://localhost:${port}`}/${filename}`;
      
      const image = await prisma.image.create({
        data: {
          url: imageUrl,
          width: finalMetadata.width,
          height: finalMetadata.height,
          userId: req.user.id
        }
      });

      res.json({
        success: true,
        id: image.id,
        url: imageUrl,
        width: finalMetadata.width,
        height: finalMetadata.height
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

// Get user's images (protected)
app.get("/images", authenticateToken, async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        width: true,
        height: true,
        createdAt: true
      }
    });
    res.json({ success: true, images });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Get image by ID (protected)
app.get("/images/:id", 
  authenticateToken,
  param('id').isNumeric(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const image = await prisma.image.findFirst({
        where: { 
          id: Number(id),
          userId: req.user.id 
        }
      });
      
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      res.json({ success: true, image });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to fetch image" });
    }
  }
);

// User registration
app.post("/auth/register", 
  [
    body('username').isLength({ min: 3, max: 30 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6, max: 100 })
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });
      
      if (existingUser) {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({ 
        success: true,
        user,
        token
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

// User login
app.post("/auth/login", 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({ 
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// Get current user (protected)
app.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Public carousel endpoints (for website display)
app.get("/carousel", async (req, res) => {
  try {
    const carouselItems = await prisma.carouselItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, items: carouselItems });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch carousel items" });
  }
});

// Admin carousel management (protected)
app.post("/admin/carousel", 
  authenticateToken,
  [
    body('image').notEmpty().trim(),
    body('title').isLength({ min: 1, max: 100 }).trim(),
    body('subtitle').optional().isLength({ max: 200 }).trim(),
    body('active').isBoolean()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { image, title, subtitle, active } = req.body;
      
      const carouselItem = await prisma.carouselItem.create({
        data: {
          image,
          title,
          subtitle: subtitle || null,
          active
        }
      });
      
      res.status(201).json({ success: true, item: carouselItem });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to create carousel item" });
    }
  }
);

// Get all carousel items for admin (protected)
app.get("/admin/carousel", authenticateToken, async (req, res) => {
  try {
    const carouselItems = await prisma.carouselItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, items: carouselItems });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch carousel items" });
  }
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;