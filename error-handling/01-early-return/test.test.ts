import { describe, it, expect } from 'vitest';
import { validateUserInput } from './good'; // 解答例でテスト
// import { validateUserInput } from './bad'; // 初期コードでもテスト可能

describe('validateUserInput - Early Return Pattern', () => {
  describe('Valid input', () => {
    it('should return valid result when all conditions are met', () => {
      const user = {
        email: 'user@example.com',
        age: 25,
      };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(true);
      expect(result.message).toBe('User input is valid');
    });

    it('should validate with various valid emails', () => {
      const validEmails = [
        'test@domain.com',
        'user.name@company.co.jp',
        'admin+tag@site.org',
      ];

      validEmails.forEach((email) => {
        const result = validateUserInput({ email, age: 18 });
        expect(result.isValid).toBe(true);
      });
    });

    it('should accept any age > 0', () => {
      const ages = [1, 18, 65, 99];

      ages.forEach((age) => {
        const result = validateUserInput({
          email: 'test@example.com',
          age,
        });
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Invalid input - User object', () => {
    it('should reject null user', () => {
      const result = validateUserInput(null);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('User object is required');
    });

    it('should reject undefined user', () => {
      const result = validateUserInput(undefined);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('User object is required');
    });
  });

  describe('Invalid input - Email', () => {
    it('should reject missing email', () => {
      const user = { age: 25 };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Email is required');
    });

    it('should reject empty email', () => {
      const user = { email: '', age: 25 };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Email is required');
    });

    it('should reject email without @', () => {
      const user = {
        email: 'invalidemail.com',
        age: 25,
      };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Email must contain @');
    });
  });

  describe('Invalid input - Age', () => {
    it('should reject missing age', () => {
      const user = { email: 'test@example.com' };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Age must be greater than 0');
    });

    it('should reject age = 0', () => {
      const user = {
        email: 'test@example.com',
        age: 0,
      };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Age must be greater than 0');
    });

    it('should reject negative age', () => {
      const user = {
        email: 'test@example.com',
        age: -5,
      };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Age must be greater than 0');
    });
  });

  describe('Edge cases', () => {
    it('should reject when multiple conditions fail', () => {
      // テストは最初にマッチしたエラーメッセージを返す
      const user = { age: -5 }; // email なし、age も無効

      const result = validateUserInput(user);

      expect(result.isValid).toBe(false);
      // 最初のエラー（email の欠落）が返される
      expect(result.message).toBe('Email is required');
    });

    it('should handle object with extra properties', () => {
      const user = {
        email: 'test@example.com',
        age: 25,
        name: 'John',
        phone: '123-456-7890',
        role: 'admin',
      };

      const result = validateUserInput(user);

      expect(result.isValid).toBe(true);
      expect(result.message).toBe('User input is valid');
    });
  });
});
