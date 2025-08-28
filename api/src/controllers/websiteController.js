import prisma from "../utils/database.js"

export const createWebsiteDetails = async (req, res) => {
    try {
        const { name, about, userId } = req.body
        
        // Validate required fields
        if (!name || !about || !userId) {
            return res.status(400).json({
                success: false,
                message: "Name, about, and userId are required fields"
            })
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        })

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Check if website name already exists
        const existingWebsite = await prisma.website.findUnique({
            where: { name }
        })

        if (existingWebsite) {
            return res.status(409).json({
                success: false,
                message: "Website name already exists"
            })
        }

        // Create the website
        const website = await prisma.website.create({
            data: {
                name,
                About: about,
                userId: parseInt(userId)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        })

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId: parseInt(userId),
                action: "create_website",
                details: JSON.stringify({
                    websiteId: website.id,
                    websiteName: website.name
                }),
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            }
        })

        return res.status(201).json({
            success: true,
            message: "Website created successfully",
            data: website
        })

    } catch (error) {
        console.error("Error creating website:", error)
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const getWebsiteDetails = async (req, res) => {
    try {
        const { websiteId } = req.params

        const website = await prisma.website.findUnique({
            where: { id: parseInt(websiteId) },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                images: true,
                carouselItems: {
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: website
        })

    } catch (error) {
        console.error("Error fetching website:", error)
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const updateWebsiteDetails = async (req, res) => {
    try {
        const { id } = req.params
        const { name, about } = req.body

        // Check if website exists
        const existingWebsite = await prisma.website.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingWebsite) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            })
        }

        // Check if new name already exists (if name is being updated)
        if (name && name !== existingWebsite.name) {
            const nameExists = await prisma.website.findUnique({
                where: { name }
            })

            if (nameExists) {
                return res.status(409).json({
                    success: false,
                    message: "Website name already exists"
                })
            }
        }

        const updatedWebsite = await prisma.website.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(about && { About: about })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        })

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId: updatedWebsite.userId,
                action: "update_website",
                details: JSON.stringify({
                    websiteId: updatedWebsite.id,
                    changes: { name, about }
                }),
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            }
        })

        return res.status(200).json({
            success: true,
            message: "Website updated successfully",
            data: updatedWebsite
        })

    } catch (error) {
        console.error("Error updating website:", error)
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const deleteWebsite = async (req, res) => {
    try {
        const { id } = req.params

        // Check if website exists
        const existingWebsite = await prisma.website.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingWebsite) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            })
        }

        // Delete website (cascade will handle related records)
        await prisma.website.delete({
            where: { id: parseInt(id) }
        })

        // Log the activity
        await prisma.activityLog.create({
            data: {
                userId: existingWebsite.userId,
                action: "delete_website",
                details: JSON.stringify({
                    websiteId: existingWebsite.id,
                    websiteName: existingWebsite.name
                }),
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            }
        })

        return res.status(200).json({
            success: true,
            message: "Website deleted successfully"
        })

    } catch (error) {
        console.error("Error deleting website:", error)
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const getUserWebsites = async (req, res) => {
    try {
        const { userId } = req.params

        const websites = await prisma.website.findMany({
            where: { userId: parseInt(userId) },
            include: {
                images: {
                    take: 1 // Get first image as thumbnail
                },
                _count: {
                    select: {
                        images: true,
                        CarouselItem: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        })

        return res.status(200).json({
            success: true,
            data: websites
        })

    } catch (error) {
        console.error("Error fetching user websites:", error)
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}