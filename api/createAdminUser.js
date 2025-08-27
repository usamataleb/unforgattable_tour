// create-admin-user.js
// Run this script to create an admin user manually

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Admin user details
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'unf0rg3tt@bl3' // Change this to a secure password, 
    };

    console.log('Creating admin user...');

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: adminData.email },
          { username: adminData.username }
        ]
      }
    });

    if (existingUser) {
      console.log('❌ User already exists with this email or username');
      console.log('Existing user:', {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email
      });
      return;
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('User details:', user);
    console.log('\n📝 Login credentials:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createAdminUser();