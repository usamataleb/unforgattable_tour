// routers/admin.js
import express from "express";
import { body } from 'express-validator';
import { getAllCarouselItems, createCarouselItem } from '../controllers/carouselController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../utils/upload.js'; // Import upload middleware

const router = express.Router();

router.get("/carousel", authenticateToken, getAllCarouselItems);

router.post("/carousel", 
  authenticateToken,
  upload.single('image'), 
  [
    body('title').isLength({ min: 1, max: 100 }).trim(),
    body('subtitle').optional().isLength({ max: 200 }).trim(),
    body('active').isBoolean()
  ],
  handleValidationErrors,
  createCarouselItem
);

export default router;