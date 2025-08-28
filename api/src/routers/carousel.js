import express from 'express';
import { body } from 'express-validator';
import { createCarouselItem } from '../controllers/carouselController.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';
import { getCarouselById } from '../controllers/carouselController.js';
import { deleteCarouselItem } from '../controllers/carouselController.js';
import { updateCarouselItem } from '../controllers/carouselController.js';
import { getWebsiteCarouselItems } from '../controllers/carouselController.js';
import { limiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post(
	'/:websiteId',
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

router.get('/websiteId/:websiteId', limiter, getWebsiteCarouselItems);

router.get('/:id', getCarouselById);

router.put('/:id', authenticateToken, updateCarouselItem);

router.delete('/:id', authenticateToken, deleteCarouselItem);

export default router;
