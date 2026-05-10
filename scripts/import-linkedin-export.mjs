/**
 * Script para transformar datos exportados de LinkedIn al formato del portfolio
 *
 * LinkedIn permite exportar tus datos en:
 * Settings & Privacy → Data privacy → Get a copy of your data
 *
 * Este script lee los archivos CSV/JSON exportados y los transforma al formato
 * estandarizado del portfolio.
 *
 * Uso:
 *   1. Descarga tu data de LinkedIn
 *   2. Copia el ZIP a la raíz del proyecto (o descomprime a scripts/linkedin-export/)
 *   3. npm run import:linkedin
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rutas
const EXPORT_DIR = join(__dirname, 'linkedin-export');
const OUTPUT_DIR = join(__dirname, '..', 'src', 'assets', 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'profile.json');

/**
 * Calcula endorsements para skills basado en experiencia, certificaciones y educación
 */
function calculateSkillEndorsements(profileData) {
  const { experience, certifications, education, skills } = profileData;
  const skillScores = new Map();

  // Inicializar todas las skills con score 0
  skills.forEach((skill) => {
    skillScores.set(skill.name, 0);
  });

  // Sumar puntos por experiencia (1 punto por año, max 5 por trabajo)
  experience.forEach((exp) => {
    const startDate = exp.startDate ? new Date(exp.startDate) : new Date();
    const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
    const years = Math.max(0, (endDate - startDate) / (1000 * 60 * 60 * 24 * 365));
    const yearsCapped = Math.min(Math.round(years), 5);

    (exp.skills || []).forEach((skillName) => {
      const current = skillScores.get(skillName) || 0;
      skillScores.set(skillName, current + yearsCapped);
    });
  });

  // Sumar puntos por certificaciones relacionadas
  const certSkillMap = {
    angular: [
      'Angular',
      'TypeScript',
      'JavaScript',
      'Front-End Development',
      'Front-end Engineering',
    ],
    node: ['Node.js', 'JavaScript', 'TypeScript'],
    ionic: ['Ionic Framework', 'Angular', 'TypeScript', 'JavaScript'],
    flutter: ['Flutter', 'Dart'],
    spring: ['Java', 'Spring', 'Back-End Development'],
    redux: ['RxJS', 'Angular', 'TypeScript', 'JavaScript'],
    pwa: ['PWA', 'JavaScript', 'TypeScript', 'Service Workers'],
    javascript: ['JavaScript', 'TypeScript', 'Node.js'],
    scrum: ['SCRUM', 'Agile', 'Team Management', 'Project Management'],
    mongodb: ['MongoDB', 'NoSQL', 'Database'],
    mysql: ['MySQL', 'SQL', 'Database'],
  };

  certifications.forEach((cert) => {
    const certName = cert.name.toLowerCase();
    Object.entries(certSkillMap).forEach(([keyword, relatedSkills]) => {
      if (certName.includes(keyword)) {
        relatedSkills.forEach((skillName) => {
          if (skillScores.has(skillName)) {
            const current = skillScores.get(skillName);
            skillScores.set(skillName, current + 2); // +2 por certificación
          }
        });
      }
    });
  });

  // Bonus por educación relacionada
  education.forEach((edu) => {
    const field = (edu.fieldOfStudy || '').toLowerCase();
    const activities = (edu.activities || '').toLowerCase();

    const eduSkills = [];
    if (field.includes('web') || activities.includes('web')) {
      eduSkills.push('HTML', 'CSS', 'JavaScript', 'Front-End Development');
    }
    if (field.includes('programming') || field.includes('desarrollo')) {
      eduSkills.push('JavaScript', 'TypeScript', 'Angular', 'Java');
    }

    eduSkills.forEach((skillName) => {
      if (skillScores.has(skillName)) {
        const current = skillScores.get(skillName);
        skillScores.set(skillName, current + 1);
      }
    });
  });

  // Convertir scores a endorsements (multiplicador para hacerlos más visibles)
  const multiplier = 3;
  return skills.map((skill) => ({
    name: skill.name,
    endorsements: Math.round((skillScores.get(skill.name) || 0) * multiplier),
  }));
}

/**
 * Parsea un archivo CSV manejando campos entre comillas
 */
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return null;

  // Función para parsear una línea CSV respetando comillas
  function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Comilla escapada
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0]);
  const values = parseLine(lines[1]);

  const data = {};
  headers.forEach((header, index) => {
    data[header] = values[index] || '';
  });

  return data;
}

/**
 * Lee un archivo CSV del export de LinkedIn
 */
function readLinkedInCSV(filename) {
  const filePath = join(EXPORT_DIR, filename);

  if (!existsSync(filePath)) {
    console.warn(`   ⚠️  No encontrado: ${filename}`);
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return parseCSV(content);
  } catch (error) {
    console.warn(`   ⚠️  Error leyendo ${filename}: ${error.message}`);
    return null;
  }
}

/**
 * Lee y parsea un archivo JSON del export de LinkedIn
 */
function readLinkedInJSON(filename) {
  const filePath = join(EXPORT_DIR, filename);

  if (!existsSync(filePath)) {
    console.warn(`   ⚠️  No encontrado: ${filename}`);
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`   ⚠️  Error leyendo ${filename}: ${error.message}`);
    return null;
  }
}

/**
 * Transforma datos del export de LinkedIn al formato del portfolio
 */
function transformLinkedInExport() {
  console.log('📁 Leyendo archivos exportados de LinkedIn...\n');

  // Intentar leer CSV primero (formato básico)
  const profileCSV = readLinkedInCSV('Profile.csv');

  // Intentar leer JSON (formato completo si está disponible)
  const profileJSON = readLinkedInJSON('Profile.json');
  const positions = readLinkedInJSON('Positions.json');
  const educations = readLinkedInJSON('Education.json');
  const skills = readLinkedInJSON('Skills.json');
  const certifications = readLinkedInJSON('Certifications.json');
  const projects = readLinkedInJSON('Projects.json');
  const languages = readLinkedInJSON('Languages.json');

  // Usar datos disponibles (CSV o JSON)
  const profile = profileJSON || profileCSV;

  if (!profile) {
    throw new Error(
      'No se encontró Profile.json. Asegúrate de copiar los archivos exportados a scripts/linkedin-export/'
    );
  }

  console.log('✅ Archivos encontrados, procesando...\n');

  // Extraer datos básicos del perfil
  const firstName = profile['First Name']?.trim() || profile.firstName?.trim() || '';
  const lastName = profile['Last Name']?.trim() || profile.lastName?.trim() || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const headline =
    profile.Headline?.trim() || profile.headline?.trim() || profile.Headline?.trim() || null;
  const summary =
    profile.Summary?.trim() || profile.summary?.trim() || profile.Summary?.trim() || null;

  // Parsear ubicación (CSV usa 'Geo Location', JSON usa 'Location')
  const geoLocation =
    profile['Geo Location']?.trim() ||
    profile.Location?.trim() ||
    profile.location?.trim() ||
    '';
  const locationParts = geoLocation.split(/,\s*/);

  // Extraer vanity name de la URL pública
  const publicUrl =
    profile['Public Profile URL'] ||
    profile.publicProfileUrl ||
    profile['URL To Your Public Profile'] ||
    '';
  const vanityNameMatch = publicUrl.match(/linkedin\.com\/in\/([^/]+)/);
  const vanityName = vanityNameMatch?.[1] || 'grodriguez1992';

  // Transformar experiencias
  const experience = (positions || []).map((pos, index) => {
    const title = pos.Title || pos.title || pos['Job Title'] || pos.CreditType || 'Sin título';
    const company =
      pos['Company Name'] ||
      pos.company?.name ||
      pos.companyName ||
      pos['Nombre de la organización'] ||
      null;
    const location = pos.Location || pos.location || pos.Locación || pos.Locación || null;
    const description =
      pos.Description ||
      pos.description ||
      pos.Descripción ||
      pos['Funciones adicionales'] ||
      null;

    // Parsear fechas
    const startDate = parseLinkedInDate(pos['Started On'] || pos.startDate || pos.startedOn);
    const endDate = parseLinkedInDate(pos['Finished On'] || pos.endDate || pos.finishedOn);
    const isCurrent = !endDate;

    return {
      id: `exp-${index}`,
      title: title.trim(),
      company: company?.trim() || null,
      companyLogoUrl: null,
      location: location?.trim() || null,
      employmentType: null,
      startDate,
      endDate,
      isCurrent,
      description: description?.trim() || null,
      skills: [],
    };
  });

  // Transformar educación
  const education = (educations || []).map((edu, index) => {
    const school =
      edu['School Name'] || edu.school?.name || edu.schoolName || edu.Institución || '';
    const degree =
      edu['Degree Name'] ||
      edu.degree?.name ||
      edu.degreeName ||
      edu.Titulación ||
      edu.Titulación ||
      null;
    const fieldOfStudy =
      edu['Field Of Study'] ||
      edu.fieldOfStudy ||
      edu['Campo de estudio'] ||
      edu.CampoDeEstudio ||
      null;
    const grade = edu.Grade || edu.grade || edu.Nota || edu.Nota || null;
    const activities =
      edu.Activities || edu.activities || edu['Actividades y sociedades'] || null;

    const startDate = parseLinkedInDate(edu['Start Date'] || edu.startDate || edu.fechaInicio);
    const endDate = parseLinkedInDate(edu['End Date'] || edu.endDate || edu.fechaFin);

    return {
      id: `edu-${index}`,
      school: school.trim(),
      degree: degree?.trim() || null,
      fieldOfStudy: fieldOfStudy?.trim() || null,
      startDate,
      endDate,
      grade: grade?.trim() || null,
      activities: activities?.trim() || null,
    };
  });

  // Transformar skills
  const skillsList = (skills || [])
    .map((skill) => ({
      name: skill.Name || skill.name || skill.Habilidad || '',
      endorsements:
        parseInt(
          skill['Endorsement Count'] || skill.endorsements || skill['Número de validaciones'],
          10
        ) || 0,
    }))
    .filter((s) => s.name);

  // Transformar certificaciones
  const certsList = (certifications || [])
    .map((cert, index) => ({
      id: `cert-${index}`,
      name: cert.Name || cert.name || cert.Nombre || '',
      issuingOrganization:
        cert.Authority ||
        cert.authority ||
        cert['Organización emisora'] ||
        cert.issuingOrganization ||
        '',
      issueDate: parseLinkedInDate(cert['Started On'] || cert.startDate || cert.issueDate),
      expirationDate: parseLinkedInDate(cert['Finished On'] || cert.endDate || cert.expirationDate),
      credentialUrl:
        cert['Certification URL'] || cert.url || cert.URL || cert.credentialUrl || null,
    }))
    .filter((c) => c.name);

  // Transformar proyectos
  const projectsList = (projects || [])
    .map((proj, index) => ({
      id: `proj-${index}`,
      name: proj.Name || proj.name || proj.Nombre || '',
      description: proj.Description || proj.description || proj.Descripción || null,
      url: proj.URL || proj.url || null,
      technologies: [],
      startDate: parseLinkedInDate(proj['Start Date'] || proj.startDate),
      endDate: parseLinkedInDate(proj['End Date'] || proj.endDate),
    }))
    .filter((p) => p.name);

  // Transformar idiomas
  const languagesList = (languages || [])
    .map((lang) => ({
      language: lang.Name || lang.name || lang.Idioma || '',
      proficiency:
        lang.Proficiency || lang.proficiency || lang['Nivel de dominio'] || 'Nativo o bilingüe',
    }))
    .filter((l) => l.language);

  // Construir datos base del perfil
  const baseProfile = {
    _meta: {
      source: 'linkedin-export',
      syncedAt: new Date().toISOString(),
      profileId: vanityName,
      note: 'Datos obtenidos desde exportación oficial de LinkedIn',
    },
    firstName,
    lastName,
    fullName,
    headline,
    email: null, // No incluido en export por privacidad
    linkedInUrl: publicUrl || `https://linkedin.com/in/${vanityName}`,
    vanityName,
    profilePictureUrl: null, // Requiere descarga separada
    location: {
      city: locationParts[0] || null,
      country: locationParts[1] || null,
      countryCode: null,
    },
    summary,
    industry: profile.Industry || profile.industry || null,
    experience,
    education,
    skills: skillsList,
    certifications: certsList,
    projects: projectsList,
    languages: languagesList,
    contactInfo: {
      email: profile['Email Address'] || profile.email || null,
      website: profile.Websites?.[0]?.url || null,
      github: null,
      twitter: profile['Twitter Handles'] || null,
    },
    interests: [],
    honors: [],
  };

  // Añadir skills de experiencias al objeto para cálculo
  baseProfile.experience = baseProfile.experience.map((exp, index) => {
    const originalPos = positions?.[index];
    const skillsFromPos = originalPos?.Skills || originalPos?.skills || '';
    const skillsArray = skillsFromPos
      ? skillsFromPos
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter((s) => s)
      : [];
    return { ...exp, skills: skillsArray };
  });

  // Calcular endorsements basados en experiencia, certificaciones y educación
  const calculatedSkills = calculateSkillEndorsements(baseProfile);

  return {
    ...baseProfile,
    skills: calculatedSkills,
  };
}

/**
 * Parsea fechas de LinkedIn (varios formatos posibles)
 */
function parseLinkedInDate(dateValue) {
  if (!dateValue) return null;

  // Formato: "2020-03-01" (ISO)
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  // Formato: "Mar 2020" o "Marzo 2020"
  if (typeof dateValue === 'string') {
    const monthYearMatch = dateValue.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (monthYearMatch) {
      const monthNames = {
        en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
        es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      };

      const monthStr = monthYearMatch[1].toLowerCase().substring(0, 3);
      const year = monthYearMatch[2];

      let month = monthNames.en.indexOf(monthStr);
      if (month === -1) {
        month = monthNames.es.indexOf(monthStr);
      }

      if (month !== -1) {
        return `${year}-${String(month + 1).padStart(2, '0')}-01`;
      }
    }
  }

  // Formato objeto { year: 2020, month: 3 }
  if (typeof dateValue === 'object' && dateValue.year) {
    const month = dateValue.month || 1;
    return `${dateValue.year}-${String(month).padStart(2, '0')}-01`;
  }

  return null;
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Importando datos exportados de LinkedIn...\n');

  try {
    // Verificar directorio de export
    if (!existsSync(EXPORT_DIR)) {
      console.log('📁 Creando directorio para archivos exportados...');
      mkdirSync(EXPORT_DIR, { recursive: true });
      console.log(`\n⚠️  Directorio creado: ${EXPORT_DIR}`);
      console.log('\n💡 Instrucciones:');
      console.log('   1. Ve a linkedin.com/mypreferences/d/download-my-data');
      console.log('   2. Solicita exportación');
      console.log(`   3. Copia los archivos CSV/JSON a: ${EXPORT_DIR}`);
      console.log('   4. Ejecuta: npm run import:linkedin\n');
      process.exit(0);
    }

    // Transformar datos
    const profileData = transformLinkedInExport();

    // Crear directorio de salida si no existe
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Guardar archivo
    writeFileSync(OUTPUT_FILE, JSON.stringify(profileData, null, 2));

    console.log('\n✅ Importación completada exitosamente');
    console.log(`📄 Archivo guardado: ${OUTPUT_FILE}`);
    console.log('\n📊 Resumen de datos importados:');
    console.log(`   - Nombre: ${profileData.fullName}`);
    console.log(`   - Headline: ${profileData.headline || '❌'}`);
    console.log(
      `   - Ubicación: ${profileData.location.city || '❌'}, ${profileData.location.country || '❌'}`
    );
    console.log(`   - Experiencias: ${profileData.experience.length}`);
    console.log(`   - Educación: ${profileData.education.length}`);
    console.log(`   - Skills: ${profileData.skills.length}`);
    console.log(`   - Certificaciones: ${profileData.certifications.length}`);
    console.log(`   - Proyectos: ${profileData.projects.length}`);
    console.log(`   - Idiomas: ${profileData.languages.length}`);
  } catch (error) {
    console.error('\n❌ Error durante la importación:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
