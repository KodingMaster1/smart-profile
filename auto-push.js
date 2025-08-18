const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const WATCH_DIR = '.';
const IGNORE_PATTERNS = [
    '.git',
    'node_modules',
    '.gitignore',
    'auto-push.js',
    'package-lock.json',
    'yarn.lock'
];

let isCommitting = false;
let pendingChanges = false;

// Function to check if a path should be ignored
function shouldIgnore(filePath) {
    return IGNORE_PATTERNS.some(pattern => 
        filePath.includes(pattern) || path.basename(filePath) === pattern
    );
}

// Function to execute git commands
function executeGitCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${command}:`, error);
                reject(error);
            } else {
                console.log(`✓ ${command}`);
                resolve(stdout);
            }
        });
    });
}

// Function to auto-commit and push changes
async function autoCommitAndPush() {
    if (isCommitting) {
        pendingChanges = true;
        return;
    }

    isCommitting = true;
    console.log('\n🔄 Auto-committing changes...');

    try {
        // Check if there are any changes to commit
        const status = await executeGitCommand('git status --porcelain');
        
        if (!status.trim()) {
            console.log('No changes to commit');
            isCommitting = false;
            return;
        }

        // Add all changes
        await executeGitCommand('git add -A');
        
        // Create commit with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await executeGitCommand(`git commit -m "Auto-save: ${timestamp}"`);
        
        // Push to remote
        await executeGitCommand('git push');
        
        console.log('✅ Changes auto-committed and pushed successfully!');
        
    } catch (error) {
        console.error('❌ Error during auto-commit:', error.message);
    } finally {
        isCommitting = false;
        
        // If there were pending changes while we were committing, process them
        if (pendingChanges) {
            pendingChanges = false;
            setTimeout(autoCommitAndPush, 1000);
        }
    }
}

// Debounce function to avoid too many commits
let debounceTimer;
function debouncedAutoCommit() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(autoCommitAndPush, 2000); // Wait 2 seconds after last change
}

// Watch for file changes
function watchDirectory(dir) {
    console.log(`👀 Watching directory: ${dir}`);
    
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (!filename || shouldIgnore(filename)) {
            return;
        }
        
        console.log(`📝 File changed: ${filename} (${eventType})`);
        debouncedAutoCommit();
    });
}

// Main function
async function main() {
    console.log('🚀 Starting auto-push watcher...');
    console.log('Press Ctrl+C to stop\n');
    
    try {
        // Check if we're in a git repository
        await executeGitCommand('git status');
        
        // Start watching
        watchDirectory(WATCH_DIR);
        
    } catch (error) {
        console.error('❌ Error: Not a git repository or git not available');
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Stopping auto-push watcher...');
    process.exit(0);
});

// Start the watcher
main(); 