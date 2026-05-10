#!/usr/bin/env node

/**
 * Script para comprimir archivos estáticos con gzip
 * Se ejecuta después del build para generar versiones .gz
 */

import { createReadStream, createWriteStream, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist', 'portfolio');

// Extensiones de archivos que deben comprimirse
const COMPRESSIBLE_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.svg',
  '.txt',
  '.xml',
  '.webmanifest',
]);

/**
 * Comprime un archivo individual
 */
function compressFile(filePath) {
  try {
    const stats = statSync(filePath);
    const input = createReadStream(filePath);
    const output = createWriteStream(`${filePath}.gz`);
    const gzip = createGzip({ level: 9 });

    pipeline(input, gzip, output)
      .then(() => {
        const originalSize = stats.size;
        const compressedStats = statSync(`${filePath}.gz`);
        const compressedSize = compressedStats.size;
        const savings = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

        const relativePath = relative(DIST_DIR, filePath);
        console.log(
          `✅ ${relativePath}: ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${savings}% saved)`
        );
      })
      .catch((err) => {
        console.error(`❌ Error compressing ${filePath}:`, err.message);
      });
  } catch (error) {
    console.error(`❌ Error accessing ${filePath}:`, error.message);
  }
}

/**
 * Formatea bytes a formato legible
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

/**
 * Encuentra recursivamente archivos para comprimir
 */
function findFilesToCompress(dir) {
  const files = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        files.push(...findFilesToCompress(fullPath));
      } else if (stats.isFile()) {
        const ext = extname(item).toLowerCase();
        if (COMPRESSIBLE_EXTENSIONS.has(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }

  return files;
}

/**
 * Función principal
 */
async function main() {
  console.log('🗜️  Comprimiendo archivos estáticos...\n');

  try {
    const stats = statSync(DIST_DIR);
    if (!stats.isDirectory()) {
      throw new Error(`Distribution directory not found: ${DIST_DIR}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log('💡 Run "npm run build" first to generate the dist directory');
    process.exit(1);
  }

  const filesToCompress = findFilesToCompress(DIST_DIR);

  if (filesToCompress.length === 0) {
    console.log('ℹ️  No files found to compress');
    return;
  }

  console.log(`📁 Found ${filesToCompress.length} files to compress\n`);

  // Comprimir archivos en paralelo
  await Promise.all(filesToCompress.map((file) => compressFile(file)));

  console.log('\n✅ Compression completed!');
  console.log('📄 Files with .gz extension will be served automatically by CDNs and servers');
}

main().catch((error) => {
  console.error('\n❌ Compression failed:', error.message);
  process.exit(1);
});
