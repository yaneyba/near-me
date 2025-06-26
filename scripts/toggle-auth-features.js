// Auth Features Toggle Script
// This script allows toggling authentication features directly from the command line

import readline from 'readline';
import fs from 'fs';
import path from 'path';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

// Function to save auth feature flags to a file
const saveAuthFeatureFlags = (flags) => {
  try {
    const configDir = path.join(process.cwd(), '.config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    const configPath = path.join(configDir, 'auth-features.json');
    fs.writeFileSync(configPath, JSON.stringify(flags, null, 2));
    
    console.log(`✅ Auth feature flags saved to ${configPath}`);
    
    // Also create/update .env file with the settings
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace existing VITE_AUTH_LOGIN_ENABLED if it exists
      if (envContent.includes('VITE_AUTH_LOGIN_ENABLED=')) {
        envContent = envContent.replace(
          /VITE_AUTH_LOGIN_ENABLED=(true|false)/,
          `VITE_AUTH_LOGIN_ENABLED=${flags.loginEnabled}`
        );
      } else {
        // Add to the end if it doesn't exist
        envContent += `\nVITE_AUTH_LOGIN_ENABLED=${flags.loginEnabled}\n`;
      }
    } else {
      // Create new .env file
      envContent = `VITE_AUTH_LOGIN_ENABLED=${flags.loginEnabled}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Environment variables updated in .env file`);
    
  } catch (error) {
    console.error('❌ Error saving auth feature flags:', error.message);
  }
};

// Function to load auth feature flags from a file
const loadAuthFeatureFlags = () => {
  try {
    const configPath = path.join(process.cwd(), '.config', 'auth-features.json');
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
    
    // Check .env file as fallback
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const loginEnabledMatch = envContent.match(/VITE_AUTH_LOGIN_ENABLED=(true|false)/);
      
      if (loginEnabledMatch) {
        return {
          loginEnabled: loginEnabledMatch[1] === 'true'
        };
      }
    }
    
    // Default values
    return {
      loginEnabled: true
    };
  } catch (error) {
    console.error('❌ Error loading auth feature flags:', error.message);
    return {
      loginEnabled: true
    };
  }
};

async function toggleAuthFeatures() {
  try {
    console.log('🔐 Auth Features Toggle Script');
    console.log('=============================');
    console.log('This script allows you to toggle authentication features.\n');
    
    // Load current settings
    const currentFlags = loadAuthFeatureFlags();
    console.log('Current settings:');
    console.log(`- Login enabled: ${currentFlags.loginEnabled ? 'Yes ✅' : 'No ❌'}`);
    console.log('');
    
    // Prompt for new settings
    const loginEnabledInput = await prompt(`Enable login? (y/n) [${currentFlags.loginEnabled ? 'y' : 'n'}]: `);
    const loginEnabled = loginEnabledInput.toLowerCase() === 'y' || 
                         (loginEnabledInput === '' && currentFlags.loginEnabled);
    
    // Save new settings
    const newFlags = {
      loginEnabled
    };
    
    saveAuthFeatureFlags(newFlags);
    
    console.log('\n✅ Auth features updated successfully:');
    console.log(`- Login enabled: ${newFlags.loginEnabled ? 'Yes ✅' : 'No ❌'}`);
    console.log('\nRestart your application for changes to take effect.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    rl.close();
  }
}

toggleAuthFeatures();