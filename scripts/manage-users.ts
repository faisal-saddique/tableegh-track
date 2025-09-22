#!/usr/bin/env tsx

import bcrypt from 'bcryptjs';
import { db } from '../src/server/db.js';

const prisma = db;

interface UserInput {
  name: string;
  username: string;
  email: string;
  password?: string;
}

async function createUser(userData: UserInput) {
  try {
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 12)
      : undefined;

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    console.log(`✅ User created successfully:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    if (userData.password) {
      console.log(`   Password: ${userData.password}`);
    }

    return user;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            contacts: true,
            visits: true,
          },
        },
      },
    });

    console.log('\n📋 All Users:');
    console.log('─'.repeat(80));

    if (users.length === 0) {
      console.log('No users found.');
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (@${user.username || 'no-username'})`);
      console.log(`   Email: ${user.email || 'No email'}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Verified: ${user.emailVerified ? '✅' : '❌'}`);
      console.log(`   Contacts: ${user._count.contacts}, Visits: ${user._count.visits}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error listing users:', error);
    throw error;
  }
}

async function deleteUser(identifier: string) {
  try {
    // Try to find user by username, email, or ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { id: identifier },
        ],
      },
    });

    if (!user) {
      console.log(`❌ User not found: ${identifier}`);
      return;
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log(`✅ User deleted successfully:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
}

async function seedDefaultBlocks() {
  const defaultBlocks = [
    { name: 'G Block', description: 'G Block area in New City Housing Society Bahawalnagar' },
    { name: 'H Block', description: 'H Block area in New City Housing Society Bahawalnagar' },
    { name: 'I Block', description: 'I Block area in New City Housing Society Bahawalnagar' },
    { name: 'J Block', description: 'J Block area in New City Housing Society Bahawalnagar' },
    { name: 'K Block', description: 'K Block area in New City Housing Society Bahawalnagar' },
    { name: 'L Block', description: 'L Block area in New City Housing Society Bahawalnagar' },
    { name: 'M Block', description: 'M Block area in New City Housing Society Bahawalnagar' },
    { name: 'N Block', description: 'N Block area in New City Housing Society Bahawalnagar' },
  ];

  try {
    for (const block of defaultBlocks) {
      await prisma.block.upsert({
        where: { name: block.name },
        update: {},
        create: block,
      });
    }
    console.log('✅ Default blocks seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding blocks:', error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'create':
        if (args.length < 4) {
          console.log('Usage: tsx scripts/manage-users.ts create <name> <username> <email> [password]');
          console.log('Example: tsx scripts/manage-users.ts create "Ahmad Ali" ahmadali ahmad@example.com password123');
          process.exit(1);
        }
        await createUser({
          name: args[1]!,
          username: args[2]!,
          email: args[3]!,
          password: args[4],
        });
        break;

      case 'list':
        await listUsers();
        break;

      case 'delete':
        if (args.length < 2) {
          console.log('Usage: tsx scripts/manage-users.ts delete <email-or-id>');
          process.exit(1);
        }
        await deleteUser(args[1]!);
        break;

      case 'seed-blocks':
        await seedDefaultBlocks();
        break;

      case 'setup':
        console.log('🚀 Setting up Tableegh Track...');
        await seedDefaultBlocks();
        console.log('✅ Setup completed!');
        break;

      default:
        console.log('Tableegh Track User Management');
        console.log('─'.repeat(40));
        console.log('Available commands:');
        console.log('  create <name> <username> <email> [password]  - Create a new user');
        console.log('  list                   - List all users');
        console.log('  delete <username-email-or-id>   - Delete a user');
        console.log('  seed-blocks           - Create default blocks');
        console.log('  setup                 - Initial setup');
        console.log('');
        console.log('Examples:');
        console.log('  tsx scripts/manage-users.ts create "Ahmad Ali" ahmadali ahmad@masjid.com password123');
        console.log('  tsx scripts/manage-users.ts list');
        console.log('  tsx scripts/manage-users.ts delete ahmadali');
        console.log('  tsx scripts/manage-users.ts setup');
        break;
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();