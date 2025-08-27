import prisma from '../utils/database.js';

export const getCarouselById = async (req, res) => {
  try {
    const carouselItems = await prisma.carouselItem.findMany({
      where: { id: Number(req.params.id) },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, items: carouselItems });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch carousel items" });
  }
};

export const getAllCarouselItems = async (req, res) => {
  try {
    const carouselItems = await prisma.carouselItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, items: carouselItems });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch carousel items" });
  }
};

export const createCarouselItem = async (req, res) => {
  try {
    const { title, subtitle, active } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Generate image URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const imageUrl = `${baseUrl}/uploads/${imageFile.filename}`;

    const carouselItem = await prisma.carouselItem.create({
      data: {
        image: imageUrl,
        title,
        subtitle: subtitle || null,
        active: active === 'true' || active === true
      }
    });

    res.status(201).json({ success: true, item: carouselItem });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to create carousel item" });
  }
};

export const deleteCarouselItem = async (req, res) => {
  try {
    const { id } = req.params;
    const carouselItem = await prisma.carouselItem.findUnique({
      where: { id: parseInt(id) }
    });

    if (!carouselItem) {
      return res.status(404).json({ error: "Carousel item not found" });
    }

    await prisma.carouselItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Carousel item deleted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to delete carousel item" });
  }
};

export const updateCarouselItem = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, active } = req.body; 

  await prisma.carouselItem.update({
    where: { id: parseInt(id) },
    data: {
      title,
      subtitle,
      active
    }
  })
    .then(() => {
      res.json({ success: true, message: "Carousel item updated successfully" });
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to update carousel item" });

  })
};
