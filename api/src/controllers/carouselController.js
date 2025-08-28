import prisma from '../utils/database.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';


export const createCarouselItem = async (req, res) => {
	try {
		const { title, subtitle, active, order } = req.body;
		const imageFile = req.file;
    const { websiteId } = req.params;

		// Validate required fields
		if (!websiteId) {
			// Clean up uploaded file if validation fails
			if (imageFile && fs.existsSync(imageFile.path)) {
				fs.unlinkSync(imageFile.path);
			}
			return res.status(400).json({ error: 'Website ID is required' });
		}

		if (!imageFile) {
			return res.status(400).json({ error: 'Image file is required' });
		}

		// Verify website exists and user has permission
		const website = await prisma.website.findFirst({
			where: {
				id: parseInt(websiteId),
				userId: req.user.id
			}
		});

		if (!website) {
			// Clean up uploaded file if website not found
			if (fs.existsSync(imageFile.path)) {
				fs.unlinkSync(imageFile.path);
			}
			return res.status(404).json({ error: 'Website not found or access denied' });
		}

		// Process and optimize the image
		const optimizedFilename = `carousel-optimized-${imageFile.filename}`;
		const optimizedPath = path.join(path.dirname(imageFile.path), optimizedFilename);

		await sharp(imageFile.path)
			.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
			.jpeg({ quality: 85 })
			.toFile(optimizedPath);

		// Generate image URL
		const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
		const imageUrl = `${baseUrl}/uploads/${optimizedFilename}`;

		// Get the maximum order value to set default order
		const maxOrderItem = await prisma.carouselItem.findFirst({
			where: { websiteId: parseInt(websiteId) },
			orderBy: { order: 'desc' },
			select: { order: true }
		});

		const nextOrder = order ? parseInt(order) : (maxOrderItem?.order || 0) + 1;

		const carouselItem = await prisma.carouselItem.create({
			data: {
				image: imageUrl,
				title,
				subtitle: subtitle || null,
				active: active === 'true' || active === true,
				order: nextOrder,
				websiteId: parseInt(websiteId)
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

		// Clean up original file
		if (fs.existsSync(imageFile.path)) {
			fs.unlinkSync(imageFile.path);
		}

		// Log activity
		await prisma.activityLog.create({
			data: {
				userId: req.user.id,
				action: 'carousel_create',
				details: JSON.stringify({
					carouselItemId: carouselItem.id,
					websiteId: website.id,
					title: carouselItem.title
				}),
				ipAddress: req.ip,
				userAgent: req.get('User-Agent')
			}
		});

		res.status(201).json({
			success: true,
			message: 'Carousel item created successfully',
			item: carouselItem
		});
	} catch (err) {
		console.error('Database error:', err);
		// Clean up file on error
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}
		res.status(500).json({ error: 'Failed to create carousel item' });
	}
};

export const getCarouselById = async (req, res) => {
	try {
		const { id } = req.params;

		const carouselItem = await prisma.carouselItem.findFirst({
			where: {
				id: parseInt(id),
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
			}
		});

		if (!carouselItem) {
			return res.status(404).json({ error: 'Carousel item not found or access denied' });
		}

		res.json({ success: true, item: carouselItem });
	} catch (err) {
		console.error('Database error:', err);
		res.status(500).json({ error: 'Failed to fetch carousel item' });
	}
};

export const getWebsiteCarouselItems = async (req, res) => {
	try {
		const { websiteId } = req.params;

		const parsedWebsiteId = parseInt(websiteId);

		if (isNaN(parsedWebsiteId)) {
			return res.status(400).json({ error: 'Invalid website ID' });
		}

		const website = await prisma.website.findFirst({
			where: {
				id: parsedWebsiteId
			}
		});

		if (!website) {
			return res.status(404).json({ error: 'Website not found' });
		}

		const carouselItems = await prisma.carouselItem.findMany({
			where: {
				websiteId: parsedWebsiteId,
				active: true 
			},
			orderBy: { order: 'asc' },
			select: {
				id: true,
				image: true,
				title: true,
				subtitle: true,
				order: true
			}
		});

		res.json({ success: true, items: carouselItems });
	} catch (err) {
		console.error('Database error:', err);
		res.status(500).json({ error: 'Failed to fetch carousel items' });
	}
};

export const updateCarouselItem = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, subtitle, active, order } = req.body;
		const imageFile = req.file;

		// Find carousel item and verify ownership
		const existingItem = await prisma.carouselItem.findFirst({
			where: {
				id: parseInt(id),
				website: {
					userId: req.user.id
				}
			}
		});

		if (!existingItem) {
			if (imageFile && fs.existsSync(imageFile.path)) {
				fs.unlinkSync(imageFile.path);
			}
			return res.status(404).json({ error: 'Carousel item not found or access denied' });
		}

		let imageUrl = existingItem.image;

		if (imageFile) {
			const optimizedFilename = `carousel-optimized-${imageFile.filename}`;
			const optimizedPath = path.join(path.dirname(imageFile.path), optimizedFilename);

			await sharp(imageFile.path)
				.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
				.jpeg({ quality: 85 })
				.toFile(optimizedPath);

			// Generate new image URL
			const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
			imageUrl = `${baseUrl}/uploads/${optimizedFilename}`;

			// Delete old image file
			const oldFilename = existingItem.image.split('/').pop();
			const oldFilePath = path.join('uploads', oldFilename);

			if (fs.existsSync(oldFilePath)) {
				fs.unlinkSync(oldFilePath);
			}

			// Clean up new original file
			if (fs.existsSync(imageFile.path)) {
				fs.unlinkSync(imageFile.path);
			}
		}

		const carouselItem = await prisma.carouselItem.update({
			where: { id: parseInt(id) },
			data: {
				image: imageUrl,
				title: title || existingItem.title,
				subtitle: subtitle !== undefined ? subtitle : existingItem.subtitle,
				active: active !== undefined ? active === 'true' || active === true : existingItem.active,
				order: order ? parseInt(order) : existingItem.order
			},
			include: {
				website: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});

		// Log activity
		await prisma.activityLog.create({
			data: {
				userId: req.user.id,
				action: 'carousel_update',
				details: JSON.stringify({
					carouselItemId: carouselItem.id,
					websiteId: carouselItem.websiteId,
					title: carouselItem.title
				}),
				ipAddress: req.ip,
				userAgent: req.get('User-Agent')
			}
		});

		res.json({
			success: true,
			message: 'Carousel item updated successfully',
			item: carouselItem
		});
	} catch (err) {
		console.error('Database error:', err);
		// Clean up file on error
		if (req.file && fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
		}
		res.status(500).json({ error: 'Failed to update carousel item' });
	}
};

export const deleteCarouselItem = async (req, res) => {
	try {
		const { id } = req.params;

		// Find carousel item and verify ownership
		const carouselItem = await prisma.carouselItem.findFirst({
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

		if (!carouselItem) {
			return res.status(404).json({ error: 'Carousel item not found or access denied' });
		}

		// Delete image file from filesystem
		const filename = carouselItem.image.split('/').pop();
		const filePath = path.join('uploads', filename);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		await prisma.carouselItem.delete({
			where: { id: parseInt(id) }
		});

		// Log activity
		await prisma.activityLog.create({
			data: {
				userId: req.user.id,
				action: 'carousel_delete',
				details: JSON.stringify({
					carouselItemId: carouselItem.id,
					websiteId: carouselItem.websiteId,
					title: carouselItem.title
				}),
				ipAddress: req.ip,
				userAgent: req.get('User-Agent')
			}
		});

		res.json({
			success: true,
			message: 'Carousel item deleted successfully'
		});
	} catch (err) {
		console.error('Database error:', err);
		res.status(500).json({ error: 'Failed to delete carousel item' });
	}
};



export const reorderCarouselItems = async (req, res) => {
	try {
		const { websiteId } = req.params;
		const { items } = req.body; // Array of { id, order }

		// Verify user has access to this website
		const website = await prisma.website.findFirst({
			where: {
				id: parseInt(websiteId),
				userId: req.user.id
			}
		});

		if (!website) {
			return res.status(404).json({ error: 'Website not found or access denied' });
		}

		// Update order for each item
		const updatePromises = items.map((item) =>
			prisma.carouselItem.updateMany({
				where: {
					id: parseInt(item.id),
					websiteId: parseInt(websiteId)
				},
				data: { order: parseInt(item.order) }
			})
		);

		await Promise.all(updatePromises);

		// Log activity
		await prisma.activityLog.create({
			data: {
				userId: req.user.id,
				action: 'carousel_reorder',
				details: JSON.stringify({
					websiteId: website.id,
					itemsCount: items.length
				}),
				ipAddress: req.ip,
				userAgent: req.get('User-Agent')
			}
		});

		res.json({
			success: true,
			message: 'Carousel items reordered successfully'
		});
	} catch (err) {
		console.error('Database error:', err);
		res.status(500).json({ error: 'Failed to reorder carousel items' });
	}
};
