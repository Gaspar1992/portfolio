/**
 * Script para recalcular endorsements basado en experiencias, certificaciones y educación
 * Uso: node scripts/calculate-endorsements.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROFILE_FILE = join(__dirname, '..', 'src', 'assets', 'data', 'profile.json');

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
    angular: ['Angular', 'TypeScript', 'JavaScript', 'Front-End Development', 'Front-end Engineering'],
    node: ['Node.js', 'JavaScript', 'TypeScript'],
    ionic: ['Ionic Framework', 'Angular', 'TypeScript', 'JavaScript'],
    flutter: ['Flutter', 'Dart'],
    spring: ['Java', 'Spring', 'Back-End Development'],
    redux: ['RxJS', 'Angular', 'TypeScript', 'JavaScript', 'NGRX'],
    pwa: ['PWA', 'JavaScript', 'TypeScript', 'Service Workers', 'Web Workers'],
    javascript: ['JavaScript', 'TypeScript', 'Node.js'],
    scrum: ['SCRUM', 'Agile', 'Team Management', 'Project Management'],
    mongodb: ['MongoDB', 'NoSQL', 'Database'],
    mysql: ['MySQL', 'SQL', 'Database'],
    'desarrollo web': ['HTML', 'CSS', 'JavaScript', 'Front-End Development', 'PHP'],
  };

  certifications.forEach((cert) => {
    const certName = cert.name.toLowerCase();
    Object.entries(certSkillMap).forEach(([keyword, relatedSkills]) => {
      if (certName.includes(keyword)) {
        relatedSkills.forEach((skillName) => {
          if (skillScores.has(skillName)) {
            const current = skillScores.get(skillName);
            skillScores.set(skillName, current + 2);
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
    if (field.includes('web') || activities?.includes('web')) {
      eduSkills.push('HTML', 'CSS', 'JavaScript', 'Front-End Development');
    }
    if (field.includes('programming') || field.includes('desarrollo')) {
      eduSkills.push('JavaScript', 'TypeScript', 'Angular', 'Java', 'PHP');
    }
    if (field.includes('application') || activities?.includes('application')) {
      eduSkills.push('JavaScript', 'TypeScript', 'Angular', 'Node.js');
    }

    eduSkills.forEach((skillName) => {
      if (skillScores.has(skillName)) {
        const current = skillScores.get(skillName);
        skillScores.set(skillName, current + 1);
      }
    });
  });

  // Multiplicador para hacer endorsements más visibles
  const multiplier = 3;
  return skills.map((skill) => ({
    name: skill.name,
    endorsements: Math.round((skillScores.get(skill.name) || 0) * multiplier),
  }));
}

function main() {
  console.log('🧮 Recalculando endorsements...\n');

  const content = readFileSync(PROFILE_FILE, 'utf-8');
  const profile = JSON.parse(content);

  const calculatedSkills = calculateSkillEndorsements(profile);

  // Ordenar por endorsements descendente
  calculatedSkills.sort((a, b) => b.endorsements - a.endorsements);

  profile.skills = calculatedSkills;
  profile._meta.endorsementsCalculatedAt = new Date().toISOString();

  writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));

  console.log('✅ Endorsements recalculados');
  console.log('\n📊 Top 10 skills por endorsements:');
  calculatedSkills.slice(0, 10).forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.name}: ${s.endorsements}`);
  });
  console.log(`\n📄 Archivo actualizado: ${PROFILE_FILE}`);
}

main();
