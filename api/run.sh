#!/bin/bash

# API Setup Script with Prisma (JavaScript ES Modules)
# This script creates an Express.js API with image upload functionality using Prisma ORM

set -e  # Exit on any error

echo "Starting API setup with Prisma (ES Modules)..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi


echo "Initializing Node.js project..."
npm init -y

echo "Installing dependencies..."
npm install express multer sharp cors dotenv @prisma/client
npm install --save-dev nodemon prisma

echo "Setting up ES Modules in package.json..."
# Update package.json to use ES modules
npm pkg set type="module"

echo "Initializing Prisma..."
npx prisma init

echo "Creating environment file..."
cat > .env << EOF
PORT=3000
DATABASE_URL="file:./dev.db"
UPLOAD_PATH=./uploads/
BASE_URL=http://localhost:3000
EOF

echo "Creating Prisma schema..."
cat > prisma/schema.prisma << EOF
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Image {
  id        Int      @id @default(autoincrement())
  url       String
  width     Int?
  height    Int?
  createdAt DateTime @default(now())
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Package {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  location    String
  description String?
}

model CarouselItem {
  id       Int     @id @default(autoincrement())
  image    String
  title    String
  subtitle String?
  active   Boolean @default(false)
}
EOF

echo "Creating database with Prisma..."
npx prisma migrate dev --name init
npx prisma generate

echo "Creating the main server file..."
cat > app.js << EOF
import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { path: filePath, filename } = req.file;

    // Get width and height using sharp
    const metadata = await sharp(filePath).metadata();
    const width = metadata.width;
    const height = metadata.height;

    // Save URL, width, height to database using Prisma
    const imageUrl = \`\${process.env.BASE_URL}/\${filename}\`;
    
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        width: width,
        height: height
      }
    });

    const response = {
      success: true,
      url: imageUrl,
      width: width,
      height: height,
      id: image.id
    };

    res.json(response);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all images
app.get("/images", async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(images);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Get image by ID
app.get("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await prisma.image.findUnique({
      where: { id: Number(id) }
    });
    
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    res.json(image);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password // In a real app, you should hash the password!
      }
    });
    
    res.json(user);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create a new package
app.post("/packages", async (req, res) => {
  try {
    const { name, price, location, description } = req.body;
    
    const pkg = await prisma.package.create({
      data: {
        name,
        price,
        location,
        description
      }
    });
    
    res.json(pkg);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to create package" });
  }
});

// Get all packages
app.get("/packages", async (req, res) => {
  try {
    const packages = await prisma.package.findMany();
    res.json(packages);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// Create a new carousel item
app.post("/carousel", async (req, res) => {
  try {
    const { image, title, subtitle, active } = req.body;
    
    const carouselItem = await prisma.carouselItem.create({
      data: {
        image,
        title,
        subtitle,
        active
      }
    });
    
    res.json(carouselItem);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to create carousel item" });
  }
});

// Get all carousel items
app.get("/carousel", async (req, res) => {
  try {
    const carouselItems = await prisma.carouselItem.findMany();
    res.json(carouselItems);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch carousel items" });
  }
});

// Get active carousel items
app.get("/carousel/active", async (req, res) => {
  try {
    const carouselItems = await prisma.carouselItem.findMany({
      where: { active: true }
    });
    res.json(carouselItems);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch active carousel items" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});

export default app;
EOF

echo "Creating package.json scripts..."
# Update package.json with proper scripts
cat > package.json << EOF
{
  "name": "prisma-image-api-esm",
  "version": "1.0.0",
  "description": "Express API for image uploads with Prisma (ES Modules)",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["express", "prisma", "image", "upload", "api", "esm", "modules"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^5.4.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "prisma": "^5.4.2"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
EOF

echo "Creating uploads directory..."
mkdir -p uploads

echo "Creating a simple test script..."
cat > test-api.js << EOF
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test database connection
    await prisma.\$connect();
    console.log('✅ Database connection successful');
    
    // Count existing images
    const imageCount = await prisma.image.count();
    console.log(\`📊 Total images in database: \${imageCount}\`);
    
    // Count existing users
    const userCount = await prisma.user.count();
    console.log(\`👥 Total users in database: \${userCount}\`);
    
    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
EOF

echo "Creating README file..."
cat > README.md << EOF
# Image Upload API with Prisma (ES Modules)

This is an Express.js API for handling image uploads with Prisma ORM, using ES Modules.

## Setup

1. Install dependencies: \`npm install\`
2. Initialize the database: \`npm run db:migrate\`
3. Generate Prisma client: \`npm run db:generate\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Production

\`\`\`bash
npm start
\`\`\`

## Test Database Connection

\`\`\`bash
node test-api.js
\`\`\`

## Database Management

- View and edit data: \`npm run db:studio\`
- Create new migration: \`npx prisma migrate dev --name your_migration_name\`

## API Endpoints

- POST /upload - Upload an image
- GET /images - Get all uploaded images
- GET /images/:id - Get a specific image by ID
- POST /users - Create a new user
- GET /users - Get all users
- POST /packages - Create a new package
- GET /packages - Get all packages
- POST /carousel - Create a new carousel item
- GET /carousel - Get all carousel items
- GET /carousel/active - Get active carousel items
- GET /health - Health check endpoint

## Environment Variables

- PORT: Server port (default: 3000)
- DATABASE_URL: Database connection string
- UPLOAD_PATH: Path to store uploaded images
- BASE_URL: Base URL for image links

## Example Usage

Upload an image:
\`\`\`bash
curl -X POST -F 'image=@/path/to/your/image.jpg' http://localhost:3000/upload
\`\`\`

Create a user:
\`\`\`bash
curl -X POST -H "Content-Type: application/json" -d '{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}' http://localhost:3000/users
\`\`\`
EOF

echo "Creating .gitignore file..."
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env

# Uploads
uploads/
*.jpg
*.jpeg
*.png
*.gif

# Database
*.db
*.db-journal

# Prisma
/prisma/migrations/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
EOF

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run db:migrate' to set up the database"
echo "2. Run 'node test-api.js' to test the database connection"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Use a tool like Postman to test the endpoints"
echo ""
echo "Example upload command using curl:"
echo "curl -X POST -F 'image=@/path/to/your/image.jpg' http://localhost:3000/upload"
echo ""
echo "To view your database:"
echo "npm run db:studio"