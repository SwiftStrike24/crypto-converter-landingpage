/**
 * Script to help generate new R2 credentials
 * Run with: npx tsx src/lib/generate-r2-credentials.ts
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Cloudflare R2 Credentials Generator ===');
console.log('This script will help you generate the correct .env.local file for R2 access.');
console.log('Follow these steps to create a new R2 API token:');
console.log('');
console.log('1. Go to https://dash.cloudflare.com/');
console.log('2. Select your account');
console.log('3. Go to "R2" in the sidebar');
console.log('4. Click on "Manage R2 API Tokens"');
console.log('5. Click "Create API token"');
console.log('6. Give it a name like "CryptoConverter Downloads"');
console.log('7. Select the following permissions:');
console.log('   - Object Read (required)');
console.log('   - Bucket Read (required)');
console.log('   - Object Write (optional)');
console.log('8. Set the TTL to "Never expire" or a long duration');
console.log('9. Click "Create API token"');
console.log('10. Copy the Access Key ID and Secret Access Key');
console.log('');

const questions = [
  {
    name: 'CLOUDFLARE_ACCOUNT_ID',
    message: 'Enter your Cloudflare Account ID (found in the URL of your Cloudflare dashboard):',
    validate: (value: string) => value.trim().length > 0
  },
  {
    name: 'R2_ACCESS_KEY_ID',
    message: 'Enter your R2 Access Key ID:',
    validate: (value: string) => value.trim().length > 0
  },
  {
    name: 'R2_SECRET_ACCESS_KEY',
    message: 'Enter your R2 Secret Access Key:',
    validate: (value: string) => value.trim().length > 0
  }
];

const answers: Record<string, string> = {};

const askQuestion = (index: number) => {
  if (index >= questions.length) {
    generateEnvFile();
    return;
  }

  const question = questions[index];
  rl.question(`${question.message} `, (answer) => {
    if (question.validate(answer)) {
      answers[question.name] = answer.trim();
      askQuestion(index + 1);
    } else {
      console.log('Invalid input. Please try again.');
      askQuestion(index);
    }
  });
};

const generateEnvFile = () => {
  const accountId = answers.CLOUDFLARE_ACCOUNT_ID;
  
  // Generate the .env.local file content
  const envContent = `# Cloudflare R2 credentials
CLOUDFLARE_ACCOUNT_ID=${accountId}
R2_ACCESS_KEY_ID=${answers.R2_ACCESS_KEY_ID}
R2_SECRET_ACCESS_KEY=${answers.R2_SECRET_ACCESS_KEY}
R2_ENDPOINT=https://${accountId}.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-${accountId}.r2.dev
`;

  // Check if .env.local already exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    rl.question('The .env.local file already exists. Do you want to overwrite it? (y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        writeEnvFile(envPath, envContent);
      } else {
        const backupPath = path.join(process.cwd(), '.env.r2');
        writeEnvFile(backupPath, envContent);
        console.log(`\nCredentials saved to ${backupPath}`);
        console.log('You can manually copy the R2 credentials to your .env.local file.');
      }
      rl.close();
    });
  } else {
    writeEnvFile(envPath, envContent);
    rl.close();
  }
};

const writeEnvFile = (filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`\nCredentials saved to ${filePath}`);
    console.log('\nNext steps:');
    console.log('1. Run the test script to verify your credentials:');
    console.log('   npm run test-r2');
    console.log('2. If you still have issues, check the R2-TROUBLESHOOTING.md file for more help.');
  } catch (error) {
    console.error('Error writing file:', error);
  }
};

// Start asking questions
askQuestion(0); 