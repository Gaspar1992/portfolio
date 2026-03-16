import { vi } from 'vitest';

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: readonly number[] = [0];

  constructor(
    private _callback: IntersectionObserverCallback,
    private _options?: IntersectionObserverInit
  ) {}

  disconnect(): void {
    // noop
  }

  observe(): void {
    // noop
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve(): void {
    // noop
  }
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock matchMedia if not available
if (!globalThis.matchMedia) {
  globalThis.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Mock ResizeObserver if not available
class MockResizeObserver implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {
    // noop
  }

  disconnect(): void {
    // noop
  }

  observe(): void {
    // noop
  }

  unobserve(): void {
    // noop
  }
}

globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
