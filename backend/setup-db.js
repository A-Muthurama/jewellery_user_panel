import { initializeDatabase } from './src/utils/db.js';

async function setup() {
    console.log('--- Initializing Shared Database ---');
    await initializeDatabase();
    console.log('--- Initialization Done ---');
    process.exit(0);
}

setup();
