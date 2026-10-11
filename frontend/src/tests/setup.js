import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas-confetti in headless jsdom environment
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));
