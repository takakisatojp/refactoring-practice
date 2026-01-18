import { describe, it, expect, vi } from 'vitest';
import { fetchUser, renderUserState, handleState, UserLoader, type RequestState } from './good';

describe('Discriminated Union - RequestState', () => {
  describe('RequestState types', () => {
    it('should create loading state', () => {
      const state: RequestState = { status: 'loading' };
      expect(state.status).toBe('loading');
    });

    it('should create success state with user data', () => {
      const state: RequestState = {
        status: 'success',
        data: { id: '1', name: 'John Doe' },
      };
      expect(state.status).toBe('success');
      if (state.status === 'success') {
        expect(state.data.name).toBe('John Doe');
      }
    });

    it('should create error state with error message', () => {
      const state: RequestState = {
        status: 'error',
        error: 'Network error',
      };
      expect(state.status).toBe('error');
      if (state.status === 'error') {
        expect(state.error).toBe('Network error');
      }
    });
  });

  describe('renderUserState function', () => {
    it('should render loading state', () => {
      const state: RequestState = { status: 'loading' };
      expect(renderUserState(state)).toBe('Loading...');
    });

    it('should render success state', () => {
      const state: RequestState = {
        status: 'success',
        data: { id: '1', name: 'Alice' },
      };
      expect(renderUserState(state)).toBe('User: Alice');
    });

    it('should render error state', () => {
      const state: RequestState = {
        status: 'error',
        error: 'User not found',
      };
      expect(renderUserState(state)).toBe('Error: User not found');
    });
  });

  describe('handleState function', () => {
    it('should handle loading state', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const state: RequestState = { status: 'loading' };

      handleState(state);

      expect(consoleSpy).toHaveBeenCalledWith('Request in progress...');
    });

    it('should handle success state', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const state: RequestState = {
        status: 'success',
        data: { id: '1', name: 'Bob' },
      };

      handleState(state);

      expect(consoleSpy).toHaveBeenCalledWith('Loaded user: Bob');
    });

    it('should handle error state', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      const state: RequestState = {
        status: 'error',
        error: 'Server error',
      };

      handleState(state);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load: Server error');
    });
  });

  describe('fetchUser function', () => {
    it('should return success state on valid response', async () => {
      const mockUser = { id: '1', name: 'Test User' };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      });

      const result = await fetchUser('1');

      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.data).toEqual(mockUser);
      }
    });

    it('should return error state on HTTP error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchUser('nonexistent');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.error).toContain('404');
      }
    });

    it('should return error state on network error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network failed'));

      const result = await fetchUser('1');

      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.error).toBe('Network failed');
      }
    });
  });

  describe('UserLoader class', () => {
    it('should start in loading state', () => {
      const loader = new UserLoader();
      expect(loader.state.status).toBe('loading');
    });

    it('should update state on successful load', async () => {
      const mockUser = { id: '1', name: 'John' };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const loader = new UserLoader();
      await loader.load('1');

      expect(loader.state.status).toBe('success');
      if (loader.state.status === 'success') {
        expect(loader.state.data).toEqual(mockUser);
      }
    });

    it('should update state on error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Failed'));

      const loader = new UserLoader();
      await loader.load('1');

      expect(loader.state.status).toBe('error');
    });

    it('should render current state', async () => {
      const mockUser = { id: '1', name: 'Alice' };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const loader = new UserLoader();
      await loader.load('1');

      expect(loader.render()).toBe('User: Alice');
    });

    it('should check if can retry on error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Error'));

      const loader = new UserLoader();
      await loader.load('1');

      expect(loader.canRetry()).toBe(true);
    });

    it('should get user data when success', async () => {
      const mockUser = { id: '1', name: 'Bob' };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const loader = new UserLoader();
      await loader.load('1');

      expect(loader.getUserData()).toEqual(mockUser);
    });

    it('should return null for user data when not success', () => {
      const loader = new UserLoader();
      expect(loader.getUserData()).toBeNull();
    });

    it('should get error message when error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      const loader = new UserLoader();
      await loader.load('1');

      expect(loader.getError()).toBe('Network error');
    });

    it('should return null for error when not error', async () => {
      const mockUser = { id: '1', name: 'Charlie' };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const loader = new UserLoader();
      await loader.load('1');

      expect(loader.getError()).toBeNull();
    });
  });

  describe('Type safety', () => {
    it('should narrow type in if condition', () => {
      const state: RequestState = {
        status: 'success',
        data: { id: '1', name: 'Type Test' },
      };

      if (state.status === 'success') {
        // state is now { status: 'success'; data: User }
        expect(state.data.name).toBe('Type Test');
      }
    });

    it('should narrow type in switch case', () => {
      const state: RequestState = {
        status: 'error',
        error: 'Test error',
      };

      switch (state.status) {
        case 'error':
          // state is now { status: 'error'; error: string }
          expect(state.error).toBe('Test error');
          break;
      }
    });
  });
});
