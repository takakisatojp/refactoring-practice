import { describe, it, expect } from 'vitest';
import { Ok, Err, ok, err, getUserProfile, getUserProfileAlternative, processResult, combineResults, type Result } from './good';

describe('Result Pattern', () => {
  describe('Ok class', () => {
    it('should create an Ok instance', () => {
      const result = ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
    });

    it('should map over Ok value', () => {
      const result = ok(5).map((x) => x * 2);

      expect(result.isOk()).toBe(true);
      expect((result as any).value).toBe(10);
    });

    it('should flatMap over Ok value', () => {
      const result = ok(5).flatMap((x) => ok(x * 2));

      expect(result.isOk()).toBe(true);
      expect((result as any).value).toBe(10);
    });

    it('should return default value on getOrElse', () => {
      const result = ok(42);
      expect(result.getOrElse(0)).toBe(42);
    });

    it('should unwrap Ok value', () => {
      const result = ok(42);
      expect(result.unwrap()).toBe(42);
    });

    it('should chain multiple maps', () => {
      const result = ok(2)
        .map((x) => x + 3)
        .map((x) => x * 2)
        .map((x) => x - 1);

      expect((result as any).value).toBe(9); // (2 + 3) * 2 - 1 = 9
    });
  });

  describe('Err class', () => {
    it('should create an Err instance', () => {
      const result = err('error message');
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
    });

    it('should not map over Err value', () => {
      const result = err('error').map((x) => x);

      expect(result.isErr()).toBe(true);
      expect((result as any).error).toBe('error');
    });

    it('should not flatMap over Err value', () => {
      const result = err('error').flatMap((x) => ok(x));

      expect(result.isErr()).toBe(true);
    });

    it('should return default value on getOrElse', () => {
      const result = err('error');
      expect(result.getOrElse(42)).toBe(42);
    });

    it('should throw on unwrap', () => {
      const result = err('error');
      expect(() => result.unwrap()).toThrow();
    });

    it('should mapErr over error', () => {
      const result = err('error').mapErr((e) => `Error: ${e}`);

      expect(result.isErr()).toBe(true);
      expect((result as any).error).toBe('Error: error');
    });

    it('should catch error', () => {
      const result = err('error').catch((e) => ok(`Handled: ${e}`));

      expect(result.isOk()).toBe(true);
      expect((result as any).value).toBe('Handled: error');
    });
  });

  describe('getUserProfile function', () => {
    it('should return Ok with profile when user and posts exist', async () => {
      const result = await getUserProfile('123');

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const profile = result.value;
        expect(profile.user.id).toBe('123');
        expect(profile.posts.length).toBeGreaterThan(0);
        expect(profile.postCount).toBe(profile.posts.length);
      }
    });

    it('should return Err when user ID is empty', async () => {
      const result = await getUserProfile('');

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('ValidationError');
      }
    });

    it('should process result with processResult', async () => {
      const result = await getUserProfile('123');

      let processed = false;
      processResult(
        result,
        (profile) => {
          processed = true;
          expect(profile.user).toBeDefined();
        },
        (error) => {
          fail('Should not call error handler');
        },
      );

      expect(processed).toBe(true);
    });
  });

  describe('getUserProfileAlternative function', () => {
    it('should return Ok with profile', async () => {
      const result = await getUserProfileAlternative('123');

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.user.id).toBe('123');
        expect(result.value.postCount).toBeGreaterThan(0);
      }
    });

    it('should return Err on validation failure', async () => {
      const result = await getUserProfileAlternative('');

      expect(result.isErr()).toBe(true);
    });
  });

  describe('combineResults function', () => {
    it('should combine two Ok results', () => {
      const result = combineResults(ok(1), ok(2));

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([1, 2]);
      }
    });

    it('should return first error', () => {
      const result = combineResults(err('error1'), ok(2));

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe('error1');
      }
    });

    it('should return second error if first is ok', () => {
      const result = combineResults(ok(1), err('error2'));

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe('error2');
      }
    });
  });

  describe('Result chaining patterns', () => {
    it('should chain multiple operations', () => {
      const result = ok(2)
        .flatMap((x) => ok(x + 3))
        .flatMap((x) => ok(x * 2))
        .flatMap((x) => ok(x - 1));

      expect(result.isOk()).toBe(true);
      expect((result as any).value).toBe(9);
    });

    it('should stop at first error', () => {
      const result = ok(2)
        .flatMap((x) => ok(x + 3))
        .flatMap((x) => err('error occurred'))
        .flatMap((x) => ok(x * 2)); // This should not execute

      expect(result.isErr()).toBe(true);
    });

    it('should handle error recovery with catch', () => {
      const result = err('initial error').catch((e) => ok(`Recovered from: ${e}`));

      expect(result.isOk()).toBe(true);
      expect((result as any).value).toBe('Recovered from: initial error');
    });

    it('should transform error type with mapErr', () => {
      const result = err({ code: 404 }).mapErr((e) => `HTTP Error: ${e.code}`);

      expect(result.isErr()).toBe(true);
      expect((result as any).error).toBe('HTTP Error: 404');
    });
  });

  describe('Type safety', () => {
    it('should not allow access to Ok value when Err', () => {
      const result: Result<number, string> = err('error');

      if (result.isErr()) {
        // TypeScript knows result is Err here
        expect(result.error).toBe('error');
      }
    });

    it('should not allow access to Err error when Ok', () => {
      const result: Result<number, string> = ok(42);

      if (result.isOk()) {
        // TypeScript knows result is Ok here
        expect(result.value).toBe(42);
      }
    });
  });
});
