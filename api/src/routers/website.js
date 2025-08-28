import express from 'express';
import {
	updateWebsiteDetails,
	deleteWebsite,
	getUserWebsites,
	createWebsiteDetails,
	getWebsiteDetails
} from '../controllers/websiteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createWebsiteDetails);

router.get('/:websiteId', authenticateToken, getWebsiteDetails);

router.get(':userId', authenticateToken, getUserWebsites);

router.put('/:id', authenticateToken, updateWebsiteDetails);

router.delete(':id', authenticateToken, deleteWebsite);


export default router;
