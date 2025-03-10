/**
 * Rhythm Defense Thumbnail Generator
 * 
 * This script helps generate a thumbnail image for the Rhythm Defense game.
 * It opens the thumbnail.html file in a browser window sized to 400x300 pixels,
 * which is the recommended size for game thumbnails.
 * 
 * Usage:
 * 1. Run this script with Node.js
 * 2. A browser window will open with the thumbnail preview
 * 3. Take a screenshot of the window (400x300 pixels)
 * 4. Save the screenshot as "rhythm-defense.jpg" in the images directory
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Create a simple HTTP server to serve the thumbnail.html file
const server = http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'thumbnail.html'), (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading thumbnail.html');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// Start the server on a random port
server.listen(0, () => {
    const port = server.address().port;
    const url = `http://localhost:${port}`;
    
    console.log(`Thumbnail preview server running at ${url}`);
    console.log('Opening browser window...');
    
    // Open the browser with the thumbnail preview
    let command;
    switch (process.platform) {
        case 'darwin': // macOS
            command = `open -a "Google Chrome" --args --app=${url} --window-size=400,300`;
            break;
        case 'win32': // Windows
            command = `start chrome --app=${url} --window-size=400,300`;
            break;
        default: // Linux and others
            command = `google-chrome --app=${url} --window-size=400,300`;
    }
    
    exec(command, (error) => {
        if (error) {
            console.error('Failed to open browser:', error);
            console.log('Please open this URL manually in your browser:');
            console.log(url);
        }
        
        console.log('\nInstructions:');
        console.log('1. Take a screenshot of the browser window (400x300 pixels)');
        console.log('2. Save the screenshot as "rhythm-defense.jpg" in the images directory');
        console.log('3. Press Ctrl+C to stop this server when done');
    });
});
