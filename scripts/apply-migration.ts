#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'prisma/migrations');

function getMigrations(): string[] {
  try {
    return readdirSync(MIGRATIONS_DIR)
      .filter(dir => statSync(join(MIGRATIONS_DIR, dir)).isDirectory())
      .sort();
  } catch (error) {
    console.error('❌ No migrations directory found');
    process.exit(1);
  }
}

function applyMigration(migrationName: string) {
  const migrationPath = join(MIGRATIONS_DIR, migrationName, 'migration.sql');

  try {
    console.log(`📦 Applying migration: ${migrationName}`);

    // Get database name from environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment');
    }

    // Extract database name from Turso URL
    const dbName = dbUrl.split('//')[1]?.split('.')[0];
    if (!dbName) {
      throw new Error('Could not extract database name from DATABASE_URL');
    }

    // Apply migration using Turso CLI
    const command = `export PATH="/Users/faisalsaddique/.turso:$PATH" && turso db shell ${dbName} < "${migrationPath}"`;
    execSync(command, { stdio: 'inherit' });

    console.log(`✅ Migration ${migrationName} applied successfully`);
  } catch (error) {
    console.error(`❌ Failed to apply migration ${migrationName}:`, error);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'list') {
    console.log('📋 Available migrations:');
    const migrations = getMigrations();
    migrations.forEach((migration, index) => {
      console.log(`${index + 1}. ${migration}`);
    });
    return;
  }

  if (command === 'apply') {
    const migrationName = args[1];

    if (!migrationName) {
      console.log('📋 Available migrations:');
      const migrations = getMigrations();
      migrations.forEach((migration, index) => {
        console.log(`${index + 1}. ${migration}`);
      });
      console.log('\n💡 Usage: pnpm migrate apply <migration-name>');
      console.log('💡 Or: pnpm migrate apply all');
      return;
    }

    if (migrationName === 'all') {
      console.log('🚀 Applying all migrations to Turso...');
      const migrations = getMigrations();
      migrations.forEach(migration => {
        applyMigration(migration);
      });
      console.log('✅ All migrations applied successfully!');
    } else {
      const migrations = getMigrations();
      const found = migrations.find(m => m.includes(migrationName) || m === migrationName);

      if (!found) {
        console.error(`❌ Migration not found: ${migrationName}`);
        console.log('Available migrations:');
        migrations.forEach((migration, index) => {
          console.log(`${index + 1}. ${migration}`);
        });
        process.exit(1);
      }

      applyMigration(found);
    }
    return;
  }

  // Default help
  console.log('🗄️  Turso Migration Helper');
  console.log('');
  console.log('Commands:');
  console.log('  pnpm migrate list           # List all available migrations');
  console.log('  pnpm migrate apply all      # Apply all migrations');
  console.log('  pnpm migrate apply <name>   # Apply specific migration');
  console.log('');
  console.log('Examples:');
  console.log('  pnpm migrate apply init');
  console.log('  pnpm migrate apply 20250921030510_init');
}

main();