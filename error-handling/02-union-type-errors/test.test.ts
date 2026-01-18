import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchUserData, logError, isError } from './good';

describe('fetchUserData - Union Type Errors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid user data', () => {
    it('should return valid user data', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockUser,
      });

      const result = await fetchUserData('123');

      expect(!isError(result)).toBe(true);
      expect(result).toEqual(mockUser);
    });

    it('should handle extra properties in response', async () => {
      const mockUser = {
        id: '123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'admin',
        createdAt: '2024-01-18',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockUser,
      });

      const result = await fetchUserData('456');

      expect(!isError(result)).toBe(true);
    });
  });

  describe('HTTP Errors', () => {
    it('should handle 404 Not Found error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Map([['content-type', 'application/json']]),
      });

      const result = await fetchUserData('nonexistent');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('HTTPError');
        expect(result.status).toBe(404);
        expect(result.message).toBe('User not found');
      }
    });

    it('should handle 401 Unauthorized error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('HTTPError');
        expect(result.status).toBe(401);
        expect(result.message).toBe('Unauthorized');
      }
    });

    it('should handle 500 Internal Server Error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('HTTPError');
        expect(result.status).toBe(500);
      }
    });
  });

  describe('Network Errors', () => {
    it('should handle network error', async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('NetworkError');
        expect(result.message).toContain('Failed to fetch');
      }
    });

    it('should handle network timeout', async () => {
      global.fetch = vi
        .fn()
        .mockRejectedValueOnce(new TypeError('Network request failed'));

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('NetworkError');
      }
    });
  });

  describe('Parse Errors', () => {
    it('should handle invalid content type', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/html']]),
        json: async () => ({}),
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('ParseError');
        expect(result.message).toBe('Invalid content type');
      }
    });

    it('should handle JSON parse error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => {
          throw new SyntaxError('Invalid JSON');
        },
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('ParseError');
        expect(result.message).toContain('Invalid JSON');
      }
    });

    it('should handle missing content type header', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: async () => ({}),
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('ParseError');
      }
    });
  });

  describe('Validation Errors', () => {
    it('should handle missing user id', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          name: 'John',
          email: 'john@example.com',
        }),
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('ValidationError');
        expect(result.message).toContain('ID');
      }
    });

    it('should handle missing email', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({
          id: '123',
          name: 'John',
        }),
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('ValidationError');
        expect(result.message).toContain('email');
      }
    });

    it('should handle invalid data type', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => null,
      });

      const result = await fetchUserData('123');

      expect(isError(result)).toBe(true);
      if (isError(result)) {
        expect(result.type).toBe('ValidationError');
      }
    });
  });

  describe('logError function', () => {
    it('should format NetworkError', () => {
      const error = { type: 'NetworkError' as const, message: 'Connection timeout' };
      const message = logError(error);

      expect(message).toContain('Network Error');
      expect(message).toContain('Connection timeout');
    });

    it('should format HTTPError', () => {
      const error = {
        type: 'HTTPError' as const,
        status: 404,
        message: 'User not found',
      };
      const message = logError(error);

      expect(message).toContain('404');
      expect(message).toContain('User not found');
    });

    it('should format ParseError', () => {
      const error = { type: 'ParseError' as const, message: 'Invalid JSON' };
      const message = logError(error);

      expect(message).toContain('Parse Error');
      expect(message).toContain('Invalid JSON');
    });

    it('should format ValidationError', () => {
      const error = {
        type: 'ValidationError' as const,
        message: 'Missing required fields',
      };
      const message = logError(error);

      expect(message).toContain('Validation Error');
      expect(message).toContain('Missing required fields');
    });
  });

  describe('isError type guard', () => {
    it('should identify error objects', () => {
      const error = { type: 'HTTPError' as const, status: 404, message: 'Not found' };
      expect(isError(error)).toBe(true);
    });

    it('should identify user objects', () => {
      const user = { id: '123', name: 'John', email: 'john@example.com' };
      expect(isError(user)).toBe(false);
    });
  });
});
