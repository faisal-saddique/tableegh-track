#!/usr/bin/env tsx

import { execSync } from 'child_process';

function main() {
  const args = process.argv.slice(2);
  const migrationName = args[0];

  if (!migrationName) {
    console.log('🔄 New Migration Helper');
    console.log('');
    console.log('Usage: pnpm new-migration <name>');
    console.log('');
    console.log('This will:');
    console.log('1. Create a migration against local SQLite');
    console.log('2. Apply it to your Turso database');
    console.log('');
    console.log('Example: pnpm new-migration add_user_preferences');
    return;
  }

  try {
    console.log('🚀 Creating new migration...');

    // Step 1: Temporarily switch to local SQLite for migration creation
    console.log('📝 Step 1: Creating migration file...');

    // Create temp env with local SQLite
    const tempEnv = {
      ...process.env,
      DATABASE_URL: 'file:./temp_migration.db'
    };

    execSync(`pnpm db:push`, {
      stdio: 'inherit',
      env: tempEnv
    });

    execSync(`pnpm prisma migrate dev --name ${migrationName}`, {
      stdio: 'inherit',
      env: tempEnv
    });

    // Clean up temp database
    execSync('rm -f temp_migration.db', { stdio: 'inherit' });

    console.log('✅ Migration file created successfully!');

    // Step 2: Apply to Turso
    console.log('📦 Step 2: Applying to Turso database...');
    execSync(`pnpm migrate apply ${migrationName}`, { stdio: 'inherit' });

    console.log('🎉 Migration complete! New migration applied to Turso.');

  } catch (error) {
    console.error('❌ Migration failed:', error);

    // Clean up temp database on error
    try {
      execSync('rm -f temp_migration.db', { stdio: 'ignore' });
    } catch {}

    process.exit(1);
  }
}

main();