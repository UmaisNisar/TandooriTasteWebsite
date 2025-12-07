#!/usr/bin/env node

/**
 * Generate environment variables for deployment
 * Usage: node scripts/generate-env.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate secure random secret
const generateSecret = () => {
  return crypto.randomBytes(32).toString('base64');
};

// Generate environment file content
const generateEnvContent = (isProduction = false) => {
  const secret = generateSecret();
  const url = isProduction 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';
  
  return `# NextAuth Configuration
# Generated on ${new Date().toISOString()}
NEXTAUTH_SECRET=${secret}
NEXTAUTH_URL=${url}

# Database Configuration
# For SQLite (development):
DATABASE_URL="file:./dev.db"

# For PostgreSQL (production - uncomment and update):
# DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Optional: Add other environment variables as needed
`;
};

// Main function
const main = () => {
  const args = process.argv.slice(2);
  const isProduction = args.includes('--production') || args.includes('-p');
  const outputFile = isProduction ? '.env.production' : '.env.local';
  
  const envContent = generateEnvContent(isProduction);
  const outputPath = path.join(process.cwd(), outputFile);
  
  // Check if file exists
  if (fs.existsSync(outputPath) && !args.includes('--force')) {
    console.log(`⚠️  ${outputFile} already exists. Use --force to overwrite.`);
    console.log('\nGenerated secret (for manual use):');
    console.log(generateSecret());
    return;
  }
  
  // Write file
  fs.writeFileSync(outputPath, envContent, 'utf8');
  
  console.log(`✅ Generated ${outputFile}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review and update ${outputFile}`);
  if (isProduction) {
    console.log(`   2. Update NEXTAUTH_URL with your production domain`);
    console.log(`   3. Update DATABASE_URL if using PostgreSQL`);
  }
  console.log(`   4. Never commit this file to Git!`);
};

main();

