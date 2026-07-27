const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
const dataDir = path.join(__dirname, 'src', 'data');
const dataPath = path.join(dataDir, 'mockData.js');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const content = fs.readFileSync(appPath, 'utf-8');
const lines = content.split('\n');

let dataContent = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.startsWith('function App()')) {
    break;
  }
  
  // Replace const with export const, except for imports
  if (line.startsWith('const ')) {
    dataContent += line.replace('const ', 'export const ') + '\n';
  } else if (!line.startsWith('import ')) {
    dataContent += line + '\n';
  }
}

fs.writeFileSync(dataPath, dataContent.trim() + '\n');
console.log('Successfully extracted mock data.');
