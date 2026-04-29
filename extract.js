const fs = require('fs');

const html = fs.readFileSync('data.txt', 'utf8');

const regex = /src="https:\/\/res-console\.cloudinary\.com\/dwruvre6o\/thumbnails\/v1\/image\/upload\/v(\d+)\/([^/]+)\/grid_landscape"/g;

let match;
const links = [];

while ((match = regex.exec(html)) !== null) {
  const version = match[1];
  const b64 = match[2];
  
  // base64 decode
  const publicId = Buffer.from(b64, 'base64').toString('utf8');
  
  const directLink = `https://res.cloudinary.com/dwruvre6o/image/upload/v${version}/${publicId}`;
  links.push(directLink);
}

if (links.length > 0) {
  fs.appendFileSync('CLOUDINARY_DIRECT_LINKS.txt', '\n' + links.join('\n') + '\n');
  console.log(`Extracted and appended ${links.length} links.`);
} else {
  console.log('No links found.');
}
