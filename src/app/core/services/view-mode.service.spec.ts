import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewModeService } from './view-mode.service';

describe('ViewModeService', () => {
  let service: ViewModeService;
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};
    const fakeLocalStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
    };

    vi.stubGlobal('localStorage', fakeLocalStorage);
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
        writable: true,
        configurable: true,
      });
    }

    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewModeService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created with default cinema mode', () => {
    expect(service).toBeTruthy();
    expect(service.mode()).toBe('cinema');
    expect(service.isCinema()).toBe(true);
  });

  it('should toggle mode between cinema and standard', () => {
    service.toggleMode();
    expect(service.mode()).toBe('standard');
    expect(service.isCinema()).toBe(false);

    service.toggleMode();
    expect(service.mode()).toBe('cinema');
    expect(service.isCinema()).toBe(true);
  });

  it('should set mode explicitly and persist to localStorage', () => {
    service.setMode('standard');
    expect(service.mode()).toBe('standard');
    expect(window.localStorage.getItem('portfolio_view_mode')).toBe('standard');

    service.setMode('cinema');
    expect(service.mode()).toBe('cinema');
    expect(window.localStorage.getItem('portfolio_view_mode')).toBe('cinema');
  });
});
