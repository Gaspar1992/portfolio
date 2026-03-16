import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgBuffer = readFileSync(join(__dirname, '../public/icon.svg'));

async function generateFavicons() {
  const sizes = [16, 32, 48, 64, 128, 192, 256, 512];
  
  console.log('Generating favicons...');
  
  // Generate PNG favicons for different sizes
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(__dirname, `../public/favicon-${size}x${size}.png`));
    console.log(`✓ favicon-${size}x${size}.png`);
  }
  
  // Generate main favicon.ico (multi-size ICO)
  // For ICO, we'll use the 32x32 and 16x16 PNGs
  const favicon32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
    
  const favicon16 = await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toBuffer();
  
  // Since sharp doesn't support ICO directly, we'll create a simple approach
  // Just use the 32x32 PNG as favicon.ico for now
  // For a proper multi-resolution ICO, we'd need a specialized library
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(__dirname, '../public/favicon.ico'));
  
  console.log('✓ favicon.ico (32x32)');
  
  // Generate Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(__dirname, '../public/apple-touch-icon.png'));
  
  console.log('✓ apple-touch-icon.png (180x180)');
  
  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);
