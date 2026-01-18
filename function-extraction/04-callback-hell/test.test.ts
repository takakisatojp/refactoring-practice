import { describe, it, expect, vi } from 'vitest';
import { fetchUserPosts, fetchUserPostsCallback, type UserPostsData } from './good';

describe('Callback Hell - async/await', () => {
  const mockUser = { id: '1', name: 'John' };
  const mockPosts = [
    { id: 'post1', userId: '1', title: 'First' },
    { id: 'post2', userId: '1', title: 'Second' },
  ];
  const mockComments = [
    { id: 'c1', postId: 'post1', content: 'Good post' },
    { id: 'c2', postId: 'post2', content: 'Nice!' },
  ];

  it('should fetch user posts successfully', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockComments[0]],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockComments[1]],
      });

    const result = await fetchUserPosts('1');

    expect(result.user).toEqual(mockUser);
    expect(result.posts).toEqual(mockPosts);
    expect(result.comments).toHaveLength(2);
  });

  it('should handle fetch errors', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchUserPosts('1')).rejects.toThrow('Network error');
  });

  it('should handle HTTP errors', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchUserPosts('1')).rejects.toThrow('Failed to fetch user');
  });

  it('should work with callback interface', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockComments[0]],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockComments[1]],
      });

    await new Promise<void>((resolve) => {
      fetchUserPostsCallback('1', (error, data) => {
        expect(error).toBeUndefined();
        expect(data?.user).toEqual(mockUser);
        resolve();
      });
    });
  });
});
