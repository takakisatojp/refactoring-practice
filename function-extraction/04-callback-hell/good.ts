// ✅ リファクタリング後: async/await で平坦化

interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  userId: string;
  title: string;
}

interface Comment {
  id: string;
  postId: string;
  content: string;
}

interface UserPostsData {
  user: User;
  posts: Post[];
  comments: Comment[];
}

/**
 * 改善ポイント：
 * - async/await で直線的に処理
 * - ネストが完全に平坦
 * - エラーハンドリングが try/catch で統一
 */
export async function fetchUserPosts(userId: string): Promise<UserPostsData> {
  // ステップ 1: ユーザー情報を取得
  const userResponse = await fetch(`/api/users/${userId}`);
  if (!userResponse.ok) {
    throw new Error(`Failed to fetch user: ${userResponse.status}`);
  }
  const user: User = await userResponse.json();

  // ステップ 2: ユーザーの投稿を取得
  const postsResponse = await fetch(`/api/users/${user.id}/posts`);
  if (!postsResponse.ok) {
    throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
  }
  const posts: Post[] = await postsResponse.json();

  // ステップ 3: 各投稿のコメントを並行取得
  const comments = await fetchAllComments(posts.map((p) => p.id));

  return {
    user,
    posts,
    comments,
  };
}

/**
 * ヘルパー関数：複数の投稿のコメントを並行取得
 */
async function fetchAllComments(postIds: string[]): Promise<Comment[]> {
  const commentPromises = postIds.map((postId) => fetchComments(postId));
  const commentArrays = await Promise.all(commentPromises);
  return commentArrays.flat();
}

/**
 * ヘルパー関数：1つの投稿のコメントを取得
 */
async function fetchComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`/api/posts/${postId}/comments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments for post ${postId}`);
  }
  return response.json();
}

/**
 * コールバック形式でも使えるラッパー関数
 */
export function fetchUserPostsCallback(
  userId: string,
  callback: (error?: Error, data?: UserPostsData) => void,
): void {
  fetchUserPosts(userId)
    .then((data) => callback(undefined, data))
    .catch((error) => callback(error));
}

export type { UserPostsData, User, Post, Comment };
