import express from "express";
import { param } from 'express-validator';
import { uploadImage, getUserImages, getImageById } from '../controllers/imageController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimit.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.post("/upload", 
  uploadLimiter,
  authenticateToken,
  upload.single("image"), 
  uploadImage
);

router.get("/", authenticateToken, getUserImages);

router.get("/:id", 
  authenticateToken,
  param('id').isNumeric(),
  handleValidationErrors,
  getImageById
);

export default router;
