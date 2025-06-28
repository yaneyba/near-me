const fs = require('fs');
const { createCanvas } = require('canvas');

// Create canvas
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

// Blue theme colors
const colors = {
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#60a5fa',
    background: '#eff6ff'
};

// Background
ctx.fillStyle = colors.background;
ctx.fillRect(0, 0, 400, 400);

// Main circle background
ctx.beginPath();
ctx.arc(200, 200, 180, 0, 2 * Math.PI);
ctx.fillStyle = 'white';
ctx.fill();
ctx.strokeStyle = colors.primary;
ctx.lineWidth = 4;
ctx.stroke();

// Location pin icon
ctx.beginPath();
ctx.arc(200, 160, 40, 0, 2 * Math.PI);
ctx.fillStyle = colors.primary;
ctx.fill();

// Pin point
ctx.beginPath();
ctx.moveTo(200, 200);
ctx.lineTo(180, 240);
ctx.lineTo(220, 240);
ctx.closePath();
ctx.fillStyle = colors.primary;
ctx.fill();

// Inner pin circle
ctx.beginPath();
ctx.arc(200, 160, 20, 0, 2 * Math.PI);
ctx.fillStyle = 'white';
ctx.fill();

// Small accent dots around the pin
const dots = [
    {x: 150, y: 140, size: 8},
    {x: 250, y: 140, size: 8},
    {x: 130, y: 180, size: 6},
    {x: 270, y: 180, size: 6},
    {x: 140, y: 220, size: 5},
    {x: 260, y: 220, size: 5}
];

dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
    ctx.fillStyle = colors.accent;
    ctx.fill();
});

// Text: "NEAR ME"
ctx.fillStyle = colors.secondary;
ctx.font = 'bold 32px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('NEAR ME', 200, 310);

// Text: ".US"
ctx.fillStyle = colors.primary;
ctx.font = 'bold 20px Arial, sans-serif';
ctx.fillText('.US', 200, 340);

// Subtitle
ctx.fillStyle = '#666';
ctx.font = '12px Arial, sans-serif';
ctx.fillText('Local Business Directory', 200, 365);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('near-me.us.png', buffer);
console.log('✅ near-me.us.png created successfully!');
