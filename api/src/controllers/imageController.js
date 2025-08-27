import sharp from "sharp";
import path from 'path';
import fs from 'fs';
import prisma from '../utils/database.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { path: filePath, filename } = req.file;

    try {
      // Process image and get metadata
      const optimizedFilename = `optimized-${filename}`;
      const optimizedPath = path.join(path.dirname(filePath), optimizedFilename);
      
      await sharp(filePath)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      // Get metadata from optimized image
      const finalMetadata = await sharp(optimizedPath).metadata();

      // Generate proper URL for static file access
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const imageUrl = `${baseUrl}/uploads/${filename}`;
      
      
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
    } catch (processingError) {
      console.error("Image processing error:", processingError);
      // Clean up uploaded file if processing fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(500).json({ error: "Failed to process image" });
    }
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const getUserImages = async (req, res) => {
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
};

export const getImageById = async (req, res) => {
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
};
