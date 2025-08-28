import express from "express";
import { param } from 'express-validator';
import { uploadImage, getUserImages, getImageById, getWebsiteImages } from '../controllers/imageController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimit.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.post("/upload/:websiteId", 
  uploadLimiter,
  authenticateToken,
  upload.single("image"), 
  uploadImage
);

router.get("/websiteId/:id", getWebsiteImages);

router.get("/", authenticateToken, getUserImages);

router.get("/:id", 
  authenticateToken,
  param('id').isNumeric(),
  handleValidationErrors,
  getImageById
);

export default router;
