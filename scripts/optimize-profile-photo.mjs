#!/usr/bin/env node
/**
 * Script para optimizar la foto de perfil para web.
 * Genera múltiples versiones: original, optimizada, thumbnail, y WebP.
 */

import { readFileSync, existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT_DIR, 'public');

// Configuración de optimización
const CONFIG = {
  inputFile: join(PUBLIC_DIR, 'profile-photo-original.jpg'),
  outputBase: join(PUBLIC_DIR, 'profile-photo'),
  sizes: {
    thumbnail: { width: 150, height: 150, quality: 80 },
    small: { width: 300, height: 300, quality: 85 },
    medium: { width: 500, height: 500, quality: 90 },
    large: { width: 800, height: 800, quality: 90 }
  }
};

async function checkSharp() {
  try {
    const sharp = await import('sharp');
    return sharp.default;
  } catch {
    console.error('❌ Error: sharp no está instalado.');
    console.log('Instalándolo ahora...');
    return null;
  }
}

async function optimizeImage() {
  console.log('🖼️  Optimizando foto de perfil...\n');

  // Verificar que existe la imagen original
  if (!existsSync(CONFIG.inputFile)) {
    console.error(`❌ No se encontró: ${CONFIG.inputFile}`);
    console.log('Asegúrate de colocar tu foto como "profile-photo-original.jpg" en la carpeta public/');
    process.exit(1);
  }

  const sharp = await checkSharp();
  if (!sharp) {
    console.log('Por favor, instala sharp manualmente: npm install sharp');
    process.exit(1);
  }

  const inputBuffer = readFileSync(CONFIG.inputFile);
  const metadata = await sharp(inputBuffer).metadata();

  console.log(`📊 Imagen original: ${metadata.width}x${metadata.height} (${Math.round(inputBuffer.length / 1024)}KB)`);
  console.log('🔄 Generando versiones optimizadas...\n');

  const results = [];

  // Generar versiones en diferentes tamaños
  for (const [name, config] of Object.entries(CONFIG.sizes)) {
    try {
      // JPEG optimizado
      const jpegBuffer = await sharp(inputBuffer)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: config.quality,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();

      const jpegPath = `${CONFIG.outputBase}-${name}.jpg`;
      await writeFile(jpegPath, jpegBuffer);

      // WebP (más ligero)
      const webpBuffer = await sharp(inputBuffer)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({
          quality: config.quality,
          effort: 6
        })
        .toBuffer();

      const webpPath = `${CONFIG.outputBase}-${name}.webp`;
      await writeFile(webpPath, webpBuffer);

      const jpegSize = Math.round(jpegBuffer.length / 1024);
      const webpSize = Math.round(webpBuffer.length / 1024);
      const savings = Math.round((1 - webpSize / jpegSize) * 100);

      results.push({
        name,
        dimensions: `${config.width}x${config.height}`,
        jpeg: { path: jpegPath, size: jpegSize },
        webp: { path: webpPath, size: webpSize },
        savings
      });

      console.log(`✅ ${name}: ${config.width}x${config.height}`);
      console.log(`   JPEG: ${jpegSize}KB | WebP: ${webpSize}KB (${savings}% más ligero)`);
    } catch (error) {
      console.error(`❌ Error generando ${name}:`, error.message);
    }
  }

  // Generar un JSON con la información de las imágenes
  const manifest = {
    original: '/profile-photo-original.jpg',
    versions: {
      thumbnail: { jpeg: '/profile-photo-thumbnail.jpg', webp: '/profile-photo-thumbnail.webp', size: '150x150' },
      small: { jpeg: '/profile-photo-small.jpg', webp: '/profile-photo-small.webp', size: '300x300' },
      medium: { jpeg: '/profile-photo-medium.jpg', webp: '/profile-photo-medium.webp', size: '500x500' },
      large: { jpeg: '/profile-photo-large.jpg', webp: '/profile-photo-large.webp', size: '800x800' }
    },
    generatedAt: new Date().toISOString()
  };

  await writeFile(
    join(PUBLIC_DIR, 'profile-photo-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('\n📄 Manifest generado: profile-photo-manifest.json');
  console.log('\n🎉 ¡Optimización completada!');
  console.log('\n📋 Resumen de archivos generados:');
  console.log('   • profile-photo-thumbnail.{jpg,webp} - Para avatares pequeños');
  console.log('   • profile-photo-small.{jpg,webp} - Para cards y listados');
  console.log('   • profile-photo-medium.{jpg,webp} - Para perfil principal');
  console.log('   • profile-photo-large.{jpg,webp} - Para vista ampliada');
}

optimizeImage().catch(console.error);
