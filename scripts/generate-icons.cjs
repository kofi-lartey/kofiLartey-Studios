const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGO_URL = 'https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');
const SIZES = [72, 96, 128, 144, 152, 192, 256, 384, 512];

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const data = [];
      response.on('data', (chunk) => data.push(chunk));
      response.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function downloadIcons() {
  console.log('Downloading logo from', LOGO_URL);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const imageData = await downloadImage(LOGO_URL);
  
  if (!imageData || imageData.length === 0) {
    console.error('Failed to download logo');
    return;
  }
  
  console.log(`Downloaded ${imageData.length} bytes`);

  for (const size of SIZES) {
    const iconUrl = `https://res.cloudinary.com/djjgkezui/image/upload/w_${size},h_${size},c_scale/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png`;
    
    console.log(`Generating ${size}x${size} icon...`);
    
    const iconData = await downloadImage(iconUrl).catch(() => null);
    
    if (iconData && iconData.length > 0) {
      fs.writeFileSync(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`), iconData);
      console.log(`  Saved icon-${size}x${size}.png (${iconData.length} bytes)`);
    } else {
      fs.writeFileSync(path.join(OUTPUT_DIR, `icon-${size}x${size}.png`), imageData);
      console.log(`  Saved original as icon-${size}x${size}.png (fallback)`);
    }
  }
  
  console.log('\nAll icons generated successfully!');
  console.log('\nNote: For maskable icons, visit https://app-manifest.firebaseapp.com/');
}

downloadIcons().catch(console.error);