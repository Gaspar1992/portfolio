/**
 * Script para sincronizar datos de LinkedIn
 * Ejecutar: node scripts/sync-linkedin.mjs
 *
 * Este script obtiene el perfil del usuario autenticado desde LinkedIn API
 * y lo guarda en src/assets/data/profile.json para consumo en Angular.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

if (!LINKEDIN_ACCESS_TOKEN) {
  console.warn('⚠️ Warning: LINKEDIN_ACCESS_TOKEN no está definido');
  console.warn('   Saltando sincronización de LinkedIn');
  console.warn('   El build continuará con los datos existentes');
  process.exit(0);
}

const OUTPUT_DIR = join(__dirname, '..', 'src', 'assets', 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'profile.json');

// Campos a solicitar a LinkedIn API
// Ref: https://learn.microsoft.com/en-us/linkedin/shared/references/v2/profile/basic-profile
const PROFILE_FIELDS = [
  'id',
  'firstName',
  'lastName',
  'localizedFirstName',
  'localizedLastName',
  'headline',
  'localizedHeadline',
  'vanityName',
  'profilePicture(displayImage~digitalmediaAsset:playableStreams)',
].join(',');

async function fetchLinkedInProfile() {
  console.log('🔍 Obteniendo perfil de LinkedIn...');

  const response = await fetch(`https://api.linkedin.com/v2/me?projection=(${PROFILE_FIELDS})`, {
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

async function fetchEmailAddress() {
  console.log('📧 Obteniendo email...');

  try {
    const response = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        headers: {
          Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!response.ok) {
      console.warn('⚠️ No se pudo obtener el email (scope r_emailaddress no concedido)');
      return null;
    }

    const data = await response.json();
    const email = data?.elements?.[0]?.['handle~']?.emailAddress;
    return email;
  } catch (error) {
    console.warn('⚠️ Error obteniendo email:', error.message);
    return null;
  }
}

function extractBestImageUrl(profilePicture) {
  if (!profilePicture || !profilePicture['displayImage~']) {
    return null;
  }

  const elements = profilePicture['displayImage~'].elements;
  if (!elements || elements.length === 0) {
    return null;
  }

  // Buscar la imagen más grande disponible
  const sortedBySize = elements
    .filter((e) => e.identifiers && e.identifiers.length > 0)
    .sort((a, b) => {
      const sizeA =
        a.data?.['com.linkedin.digitalmedia.mediaartifact.StillImage']?.displaySize?.width || 0;
      const sizeB =
        b.data?.['com.linkedin.digitalmedia.mediaartifact.StillImage']?.displaySize?.width || 0;
      return sizeB - sizeA;
    });

  return sortedBySize[0]?.identifiers[0]?.identifier || null;
}

function transformProfileData(linkedinData, email) {
  const firstName =
    linkedinData.localizedFirstName || linkedinData.firstName?.localized?.en_US || '';
  const lastName = linkedinData.localizedLastName || linkedinData.lastName?.localized?.en_US || '';
  const headline = linkedinData.localizedHeadline || linkedinData.headline?.localized?.en_US || '';

  return {
    // Metadata
    _meta: {
      source: 'linkedin',
      syncedAt: new Date().toISOString(),
      profileId: linkedinData.id,
    },
    // Datos personales
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    headline,
    email,
    // URLs
    linkedInUrl: linkedinData.vanityName
      ? `https://linkedin.com/in/${linkedinData.vanityName}`
      : null,
    vanityName: linkedinData.vanityName,
    // Imagen
    profilePictureUrl: extractBestImageUrl(linkedinData.profilePicture),
    // Datos crudos (para debugging o uso avanzado)
    _raw: linkedinData,
  };
}

async function main() {
  try {
    console.log('🚀 Iniciando sincronización con LinkedIn...\n');

    // Obtener datos
    const linkedinProfile = await fetchLinkedInProfile();
    const email = await fetchEmailAddress();

    // Transformar datos
    const profileData = transformProfileData(linkedinProfile, email);

    // Crear directorio si no existe
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Creado directorio: ${OUTPUT_DIR}`);
    }

    // Guardar archivo
    writeFileSync(OUTPUT_FILE, JSON.stringify(profileData, null, 2));

    console.log('\n✅ Sincronización completada exitosamente');
    console.log(`📄 Archivo guardado: ${OUTPUT_FILE}`);
    console.log('\n📊 Datos sincronizados:');
    console.log(`   - Nombre: ${profileData.fullName}`);
    console.log(`   - Headline: ${profileData.headline || '(no disponible)'}`);
    console.log(`   - Email: ${profileData.email || '(no disponible)'}`);
    console.log(`   - Foto: ${profileData.profilePictureUrl ? '✅' : '❌'}`);
    console.log(`   - URL: ${profileData.linkedInUrl || '(no disponible)'}`);
  } catch (error) {
    console.error('\n❌ Error durante la sincronización:');
    console.error(error.message);

    if (error.message.includes('401')) {
      console.error('\n💡 El token puede haber expirado. Necesitas generar uno nuevo.');
      console.error('   Sigue las instrucciones en LINKEDIN_SETUP.md');
    }

    process.exit(1);
  }
}

main();
