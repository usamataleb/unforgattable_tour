import sharp from "sharp";
import path from 'path';
import fs from 'fs';
import prisma from '../utils/database.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { websiteId } = req.params;

    console.log("Upload request by user:", req.user.id, "for websiteId:", websiteId);
    
    if (!websiteId) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Website ID is required" });
    }

    const website = await prisma.website.findFirst({
      where: { 
        id: parseInt(websiteId),
        userId: req.user.id 
      }
    });

    if (!website) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: "Website not found or access denied" });
    }

    const { path: filePath, filename, originalname } = req.file;

    try {
      const optimizedFilename = `optimized-${filename}`;
      const optimizedPath = path.join(path.dirname(filePath), optimizedFilename);
      
      await sharp(filePath)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      const finalMetadata = await sharp(optimizedPath).metadata();

      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const imageUrl = `${baseUrl}/uploads/${optimizedFilename}`;
      
      const image = await prisma.image.create({
        data: {
          src: imageUrl,
          width: finalMetadata.width || 0,
          height: finalMetadata.height || 0,
          filename: originalname,
          filesize: finalMetadata.size || 0,
          mimetype: req.file.mimetype,
          websiteId: parseInt(websiteId),
        },
        include: {
          website: {
            select: {
              id: true,
              name: true,
              user: {
                select: {
                  id: true,
                  username: true
                }
              }
            }
          }
        }
      });

      // Clean up original file after processing
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: "image_upload",
          details: JSON.stringify({
            imageId: image.id,
            websiteId: website.id,
            filename: originalname,
            filesize: finalMetadata.size
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          id: image.id,
          src: image.src,
          width: image.width,
          height: image.height,
          filename: image.filename,
          website: image.website
        }
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
    // Clean up file on any error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const getUserImages = async (req, res) => {
  try {
    // Get images through user's websites
    const images = await prisma.image.findMany({
      where: { 
        website: {
          userId: req.user.id
        }
      },
      include: {
        website: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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
        id: parseInt(id),
        website: {
          userId: req.user.id // Ensure user owns the website
        }
      },
      include: {
        website: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });
    
    if (!image) {
      return res.status(404).json({ error: "Image not found or access denied" });
    }
    
    res.json({ success: true, image });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

export const getWebsiteImages = async (req, res) => {
  try {
    const websiteId = req.params;
    const website = await prisma.website.findFirst({
      where: { 
        id: parseInt(websiteId.id),
      }
    });

    if (!website) {
      return res.status(404).json({ error: "Website not found or access denied" });
    }

    const images = await prisma.image.findMany({
      where: { 
        websiteId: parseInt(websiteId.id) 
      },
      orderBy: { createdAt: 'desc' },
      include: {
        imageTags: {
          include: {
            tag: true
          }
        }
      }
    });
    res.json({ success: true, images });


  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch images", err: err.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find image and verify ownership
    const image = await prisma.image.findFirst({
      where: { 
        id: parseInt(id),
        website: {
          userId: req.user.id
        }
      },
      include: {
        website: true
      }
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found or access denied" });
    }

    // Delete image file from filesystem
    const filename = image.src.split('/').pop();
    const filePath = path.join('uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete image record from database
    await prisma.image.delete({
      where: { id: parseInt(id) }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "image_delete",
        details: JSON.stringify({
          imageId: image.id,
          websiteId: image.websiteId,
          filename: image.filename
        }),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({ 
      success: true, 
      message: "Image deleted successfully" 
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
};