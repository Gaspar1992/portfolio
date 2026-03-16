/**
 * Servicio para consumir los datos del perfil sincronizados desde LinkedIn.
 * Los datos se cargan desde un JSON estático generado durante el build.
 */

import { Injectable } from '@angular/core';

export interface ProfileMeta {
  source: string;
  syncedAt: string;
  profileId: string;
  note?: string;
}

export interface ProfileLocation {
  city: string | null;
  country: string | null;
  countryCode: string | null;
}

export interface ProfileExperience {
  id: string;
  title: string;
  company: string | null;
  companyLogoUrl: string | null;
  location: string | null;
  employmentType: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  skills: string[];
}

export interface ProfileEducation {
  id: string;
  school: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  grade: string | null;
  activities: string | null;
}

export interface ProfileSkill {
  name: string;
  endorsements: number;
}

export interface ProfileCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string | null;
  credentialUrl: string | null;
}

export interface ProfileProject {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  technologies: string[];
  startDate: string;
  endDate: string | null;
}

export interface ProfileLanguage {
  language: string;
  proficiency: string;
}

export interface ProfileContactInfo {
  email: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
}

export interface ProfileHonor {
  title: string;
  description: string;
}

export interface LinkedInProfile {
  _meta: ProfileMeta;
  firstName: string;
  lastName: string;
  fullName: string;
  headline: string | null;
  email: string | null;
  linkedInUrl: string | null;
  vanityName: string | null;
  profilePictureUrl: string | null;
  location: ProfileLocation;
  summary: string | null;
  industry: string | null;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  skills: ProfileSkill[];
  certifications: ProfileCertification[];
  projects: ProfileProject[];
  languages: ProfileLanguage[];
  contactInfo: ProfileContactInfo;
  interests: string[];
  honors: ProfileHonor[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileData: LinkedInProfile | null = null;

  /**
   * Carga los datos del perfil desde el JSON estático.
   * En SSG, esto se resuelve durante la construcción.
   */
  async loadProfile(): Promise<LinkedInProfile> {
    if (this.profileData) {
      return this.profileData;
    }

    // Import dinámico del JSON (compatible con SSG)
    const module = await import('../../assets/data/profile.json');
    this.profileData = (module.default ?? module) as LinkedInProfile;

    return this.profileData;
  }

  /**
   * Obtiene los datos del perfil (cached)
   */
  getProfile(): LinkedInProfile | null {
    return this.profileData;
  }

  /**
   * Formatea la fecha de sincronización
   */
  getLastSyncedAt(): string | null {
    if (!this.profileData?._meta?.syncedAt) return null;
    return new Date(this.profileData._meta.syncedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Formatea un rango de fechas de experiencia laboral
   */
  formatExperienceDate(startDate: string, endDate: string | null, isCurrent: boolean): string {
    const start = new Date(startDate);
    const startYear = start.getFullYear();

    if (isCurrent || !endDate) {
      return `${startYear} — Present`;
    }

    const end = new Date(endDate);
    const endYear = end.getFullYear();
    return `${startYear} — ${endYear}`;
  }

  /**
   * Formatea un rango de fechas de educación
   */
  formatEducationDate(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.getFullYear()} — ${end.getFullYear()}`;
  }
}
