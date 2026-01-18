import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerUser, type UserData } from './good';

describe('Function Extraction - Long Function Split', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    const validUser: UserData = {
      email: 'test@example.com',
      password: 'securepass123',
      name: 'Test User',
      age: 25,
    };

    it('should successfully register a valid user', async () => {
      const result = await registerUser(validUser);

      expect(result.success).toBe(true);
      expect(result.userId).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid email', async () => {
      const result = await registerUser({
        ...validUser,
        email: 'invalid-email',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email');
    });

    it('should reject short password', async () => {
      const result = await registerUser({
        ...validUser,
        password: 'short',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Password');
    });

    it('should reject empty name', async () => {
      const result = await registerUser({
        ...validUser,
        name: '',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Name');
    });

    it('should reject age < 18', async () => {
      const result = await registerUser({
        ...validUser,
        age: 17,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid age');
    });

    it('should reject age > 120', async () => {
      const result = await registerUser({
        ...validUser,
        age: 121,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid age');
    });

    it('should reject duplicate email', async () => {
      // Register first user
      await registerUser(validUser);

      // Try to register with same email
      const result = await registerUser({
        ...validUser,
        name: 'Another User',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Email already registered');
    });

    it('should return different userId for each registration', async () => {
      const result1 = await registerUser(validUser);
      const result2 = await registerUser({
        ...validUser,
        email: 'another@example.com',
      });

      expect(result1.userId).not.toBe(result2.userId);
    });

    it('should handle console logging', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await registerUser(validUser);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('User registered'));
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(validUser.email),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(validUser.name),
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle whitespace-only name', async () => {
      const result = await registerUser({
        email: 'test@example.com',
        password: 'securepass123',
        name: '   ',
        age: 25,
      });

      expect(result.success).toBe(false);
    });

    it('should accept valid age boundaries', async () => {
      const result1 = await registerUser({
        email: 'test1@example.com',
        password: 'securepass123',
        name: 'Test',
        age: 18, // Minimum valid age
      });

      const result2 = await registerUser({
        email: 'test2@example.com',
        password: 'securepass123',
        name: 'Test',
        age: 120, // Maximum valid age
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });
});
