import { describe, it, expect } from 'vitest';
import {
  processApiResponse,
  filterUsers,
  parseUserJson,
  processContent,
  validateAndProcessUser,
  type User,
  type Post,
  type Content,
} from './good';

describe('Type Guard Functions', () => {
  describe('processApiResponse', () => {
    it('should process user data', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'log');
      const user: User = { id: '1', name: 'John', email: 'john@example.com' };

      processApiResponse(user);

      expect(consoleSpy).toHaveBeenCalledWith('User: John');
    });

    it('should process post data', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'log');
      const post: Post = {
        id: '1',
        title: 'Hello World',
        authorId: '123',
      };

      processApiResponse(post);

      expect(consoleSpy).toHaveBeenCalledWith('Post: Hello World');
    });

    it('should handle unknown data', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'log');

      processApiResponse({ unknown: 'data' });

      expect(consoleSpy).toHaveBeenCalledWith('Unknown data type');
    });
  });

  describe('filterUsers', () => {
    it('should filter valid users', () => {
      const items: unknown[] = [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' },
        { name: 'InvalidUser' }, // Missing id, email
        'string value',
        123,
      ];

      const users = filterUsers(items);

      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('Alice');
      expect(users[1].name).toBe('Bob');
    });

    it('should return empty array for no valid users', () => {
      const items: unknown[] = [
        { name: 'NoEmail' },
        'string',
        123,
        null,
      ];

      const users = filterUsers(items);

      expect(users).toHaveLength(0);
    });

    it('should handle mixed valid and invalid data', () => {
      const items: unknown[] = [
        { id: '1', name: 'Valid', email: 'valid@example.com' },
        { id: '2', title: 'Post', authorId: '1' },
        { id: '3', name: 'Valid2', email: 'valid2@example.com' },
      ];

      const users = filterUsers(items);

      expect(users).toHaveLength(2);
    });
  });

  describe('parseUserJson', () => {
    it('should parse valid user JSON', () => {
      const json = JSON.stringify({
        id: '1',
        name: 'John',
        email: 'john@example.com',
      });

      const user = parseUserJson(json);

      expect(user).not.toBeNull();
      expect(user?.name).toBe('John');
    });

    it('should return null for invalid user JSON', () => {
      const json = JSON.stringify({ name: 'NoEmail' });

      const user = parseUserJson(json);

      expect(user).toBeNull();
    });

    it('should return null for malformed JSON', () => {
      const user = parseUserJson('{ invalid json }');

      expect(user).toBeNull();
    });

    it('should return null for non-object JSON', () => {
      const user = parseUserJson('"string"');

      expect(user).toBeNull();
    });
  });

  describe('processContent', () => {
    it('should process user content', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'log');
      const content: Content = {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
      };

      processContent(content);

      expect(consoleSpy).toHaveBeenCalledWith('User content: Alice');
    });

    it('should process post content', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'log');
      const content: Content = {
        id: '1',
        title: 'First Post',
        authorId: '123',
      };

      processContent(content);

      expect(consoleSpy).toHaveBeenCalledWith('Post content: First Post');
    });

    it('should process string content', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'log');
      const content: Content = 'plain text';

      processContent(content);

      expect(consoleSpy).toHaveBeenCalledWith('String content: plain text');
    });
  });

  describe('validateAndProcessUser', () => {
    it('should validate and return valid user', () => {
      const data: User = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = validateAndProcessUser(data);

      expect(result).toEqual(data);
    });

    it('should return null for invalid user structure', () => {
      const data = { name: 'NoId' };

      const result = validateAndProcessUser(data);

      expect(result).toBeNull();
    });

    it('should return null for invalid email', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'warn');
      const data = {
        id: '1',
        name: 'Test',
        email: 'invalid-email', // No @ or .
      };

      const result = validateAndProcessUser(data);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('User data is invalid');
    });

    it('should return null for empty id', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'warn');
      const data = {
        id: '', // Empty
        name: 'Test',
        email: 'test@example.com',
      };

      const result = validateAndProcessUser(data);

      expect(result).toBeNull();
    });

    it('should return null for empty name', () => {
      const consoleSpy = require('vitest').vi.spyOn(console, 'warn');
      const data = {
        id: '1',
        name: '', // Empty
        email: 'test@example.com',
      };

      const result = validateAndProcessUser(data);

      expect(result).toBeNull();
    });
  });

  describe('Type safety', () => {
    it('should properly narrow types', () => {
      const value: unknown = {
        id: '1',
        name: 'Test',
        email: 'test@example.com',
      };

      if ('email' in value && typeof value === 'object') {
        // Before: value is still object
        // After using type guard: value would be User
        expect((value as User).name).toBe('Test');
      }
    });
  });
});
