import express from "express";
import { body } from 'express-validator';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/register", 
  [
    body('username').isLength({ min: 3, max: 30 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6, max: 100 })
  ],
  handleValidationErrors,
  register
);

router.post("/login", 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  handleValidationErrors,
  login
);

router.get("/me", authenticateToken, getCurrentUser);

export default router;
