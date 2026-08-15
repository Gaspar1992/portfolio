/**
 * Servicio para consumir los datos del perfil sincronizados desde LinkedIn.
 * Los datos se cargan desde un JSON estático generado durante el build.
 */

import { computed, Injectable, linkedSignal, resource } from '@angular/core';

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
  expert: boolean;
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
  /**
   * Resource reactiva de Angular 22 para la carga asíncrona del JSON del perfil.
   */
  readonly profileResource = resource({
    loader: async () => {
      const module = await import('../../assets/data/profile.json');
      return (module.default ?? module) as LinkedInProfile;
    },
  });

  readonly profile = linkedSignal(() => this.profileResource.value() ?? null);
  readonly isLoading = computed(() => this.profileResource.isLoading());
  readonly error = computed(() => this.profileResource.error());

  /**
   * Carga los datos del perfil desde el JSON estático (compatibilidad de API)
   */
  async loadProfile(): Promise<LinkedInProfile> {
    const current = this.profile();
    if (current) {
      return current;
    }

    const module = await import('../../assets/data/profile.json');
    const data = (module.default ?? module) as LinkedInProfile;
    this.profile.set(data);
    return data;
  }

  /**
   * Formatea la fecha de sincronización
   */
  getLastSyncedAt(): string | null {
    const data = this.profile();
    if (!data?._meta?.syncedAt) return null;
    return new Date(data._meta.syncedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
