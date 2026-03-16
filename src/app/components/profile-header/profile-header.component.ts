import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule],
  template: `
    @if (profile(); as p) {
      <header class="profile-header">
        @if (p.profilePictureUrl) {
          <img
            [src]="p.profilePictureUrl"
            [alt]="'Foto de ' + p.fullName"
            class="profile-picture"
            width="150"
            height="150"
          />
        }
        <div class="profile-info">
          <h1>{{ p.fullName }}</h1>
          @if (p.headline) {
            <p class="headline">{{ p.headline }}</p>
          }
          @if (p.linkedInUrl) {
            <a
              [href]="p.linkedInUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="linkedin-link"
            >
              Ver en LinkedIn
            </a>
          }
        </div>
        @if (lastSynced()) {
          <small class="sync-info">Sincronizado: {{ lastSynced() }}</small>
        }
      </header>
    } @else {
      <div class="profile-loading">
        <p>Cargando perfil...</p>
      </div>
    }
  `,
  styles: `
    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
      position: relative;
    }

    .profile-picture {
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #0077b5;
    }

    .profile-info h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }

    .headline {
      margin: 0 0 0.75rem 0;
      color: #666;
      font-size: 1.1rem;
    }

    .linkedin-link {
      color: #0077b5;
      text-decoration: none;
      font-weight: 500;
    }

    .linkedin-link:hover {
      text-decoration: underline;
    }

    .sync-info {
      position: absolute;
      bottom: 0.5rem;
      right: 0.75rem;
      color: #888;
      font-size: 0.75rem;
    }

    .profile-loading {
      padding: 2rem;
      text-align: center;
      color: #666;
    }
  `,
})
export class ProfileHeaderComponent implements OnInit {
  private readonly profileService = inject(ProfileService);

  readonly profile = signal<ReturnType<typeof this.profileService.getProfile>>(null);
  readonly lastSynced = signal<ReturnType<typeof this.profileService.getLastSyncedAt>>(null);

  async ngOnInit(): Promise<void> {
    await this.profileService.loadProfile();
    this.profile.set(this.profileService.getProfile());
    this.lastSynced.set(this.profileService.getLastSyncedAt());
  }
}
