// ❌ リファクタリング前: 毎回エラーチェックが必要

interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
}

interface UserProfile {
  user: User;
  posts: Post[];
  postCount: number;
}

type AppError = { type: string; message: string };

// 各種取得関数
async function fetchUser(userId: string): Promise<User | AppError> {
  if (!userId) {
    return { type: 'ValidationError', message: 'User ID required' };
  }
  // 実装省略（実際には API 呼び出し）
  return { id: userId, name: 'John Doe' };
}

async function fetchPosts(userId: string): Promise<Post[] | AppError> {
  if (!userId) {
    return { type: 'ValidationError', message: 'User ID required' };
  }
  return [
    { id: '1', title: 'First post', content: 'Content 1' },
    { id: '2', title: 'Second post', content: 'Content 2' },
  ];
}

function isError(value: unknown): value is AppError {
  return typeof value === 'object' && value !== null && 'type' in value;
}

/**
 * ユーザープロフィールを取得する関数
 * エラーチェックが何度も出現
 */
export async function getUserProfile(userId: string): Promise<UserProfile | AppError> {
  // ステップ 1: ユーザー取得
  const userResult = await fetchUser(userId);
  if (isError(userResult)) {
    return userResult; // エラーをそのまま返す
  }
  const user = userResult;

  // ステップ 2: 投稿一覧取得
  const postsResult = await fetchPosts(user.id);
  if (isError(postsResult)) {
    return postsResult; // またエラーチェック
  }
  const posts = postsResult;

  // ステップ 3: 投稿数をカウント
  const postCount = posts.length;
  if (postCount === 0) {
    return {
      type: 'ValidationError',
      message: 'User has no posts',
    };
  }

  // ステップ 4: プロフィールを構築
  const profile: UserProfile = {
    user,
    posts,
    postCount,
  };

  return profile;
}

/**
 * 複数ステップがある場合、さらに複雑になる
 */
export async function getEnrichedUserProfile(userId: string): Promise<UserProfile | AppError> {
  const userResult = await fetchUser(userId);
  if (isError(userResult)) {
    return userResult;
  }

  const user = userResult;

  const postsResult = await fetchPosts(user.id);
  if (isError(postsResult)) {
    return postsResult;
  }

  const posts = postsResult;

  // さらに複数のステップがある場合...
  // if (error) return error
  // if (error) return error
  // のような繰り返しが続く

  return {
    user,
    posts,
    postCount: posts.length,
  };
}
