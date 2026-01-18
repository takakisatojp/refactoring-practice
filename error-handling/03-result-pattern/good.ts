// ✅ リファクタリング後: Result型とメソッドチェーン

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

/**
 * Result型の定義
 * Ok<T>: 成功時のデータ
 * Err<E>: 失敗時のエラー
 */
class Ok<T> {
  constructor(readonly value: T) {}

  // 値を変換
  map<U>(fn: (value: T) => U): Result<U, any> {
    return new Ok(fn(this.value));
  }

  // 新しい Result を返す関数で変換（flatMap）
  flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  // エラー型を変換（エラー時は何もしない）
  mapErr<E>(fn: (error: any) => E): Result<T, E> {
    return this as any;
  }

  // エラーハンドリング
  catch<U>(fn: (error: any) => Result<U, any>): Result<T | U, any> {
    return this;
  }

  // 値を取得（エラーチェック済み）
  unwrap(): T {
    return this.value;
  }

  // 値を取得または default を返す
  getOrElse(defaultValue: T): T {
    return this.value;
  }

  // 型ガード関数
  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is Err<any> {
    return false;
  }
}

class Err<E> {
  constructor(readonly error: E) {}

  map<U>(fn: (value: any) => U): Result<U, E> {
    return this;
  }

  flatMap<U>(fn: (value: any) => Result<U, E>): Result<U, E> {
    return this;
  }

  mapErr<F>(fn: (error: E) => F): Result<any, F> {
    return new Err(fn(this.error));
  }

  catch<U>(fn: (error: E) => Result<U, any>): Result<any, any> {
    return fn(this.error);
  }

  unwrap(): never {
    throw this.error;
  }

  getOrElse<T>(defaultValue: T): T {
    return defaultValue;
  }

  isOk(): this is Ok<any> {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }
}

type Result<T, E> = Ok<T> | Err<E>;

// ヘルパー関数
function ok<T>(value: T): Result<T, never> {
  return new Ok(value);
}

function err<E>(error: E): Result<never, E> {
  return new Err(error);
}

// 各種取得関数を Result型に対応
async function fetchUser(userId: string): Promise<Result<User, AppError>> {
  if (!userId) {
    return err({
      type: 'ValidationError',
      message: 'User ID required',
    });
  }
  return ok({ id: userId, name: 'John Doe' });
}

async function fetchPosts(userId: string): Promise<Result<Post[], AppError>> {
  if (!userId) {
    return err({
      type: 'ValidationError',
      message: 'User ID required',
    });
  }
  return ok([
    { id: '1', title: 'First post', content: 'Content 1' },
    { id: '2', title: 'Second post', content: 'Content 2' },
  ]);
}

/**
 * ユーザープロフィールを取得する関数
 * 改善ポイント：
 * - flatMap でエラーを自動的に伝播
 * - 各ステップが シンプルで明確
 * - エラーチェックが不要
 */
export async function getUserProfile(userId: string): Promise<Result<UserProfile, AppError>> {
  const userResult = await fetchUser(userId);

  // flatMap でチェーン：ユーザーが取得できたら投稿を取得
  const profileResult = userResult.flatMap((user) =>
    fetchPosts(user.id).then((postsResult) =>
      postsResult
        .map((posts) => ({
          user,
          posts,
          postCount: posts.length,
        }))
        .mapErr((error) => error),
    ),
  );

  return profileResult;
}

/**
 * 別の書き方: より関数型的なアプローチ
 */
export async function getUserProfileAlternative(userId: string): Promise<Result<UserProfile, AppError>> {
  // ステップを関数で表現
  const getUserStep = () => fetchUser(userId);

  const getPostsStep = (user: User) => fetchPosts(user.id);

  const buildProfileStep = (user: User, posts: Post[]) =>
    ok({
      user,
      posts,
      postCount: posts.length,
    });

  const validatePostsStep = (profile: UserProfile) =>
    profile.postCount > 0 ? ok(profile) : err({ type: 'ValidationError', message: 'No posts' });

  // パイプライン的に実行
  const result = await getUserStep();

  if (result.isErr()) {
    return result;
  }

  const user = result.unwrap();
  const postsResult = await getPostsStep(user);

  if (postsResult.isErr()) {
    return postsResult;
  }

  const posts = postsResult.unwrap();
  const profileResult = buildProfileStep(user, posts);

  if (profileResult.isErr()) {
    return profileResult;
  }

  return validatePostsStep(profileResult.unwrap());
}

/**
 * Result を処理する際のパターンマッチング
 */
export function processResult<T, E>(result: Result<T, E>, onOk: (value: T) => void, onErr: (error: E) => void): void {
  if (result.isOk()) {
    onOk(result.value);
  } else {
    onErr(result.error);
  }
}

/**
 * 複数の Result を組み合わせる
 */
export function combineResults<T1, T2, E>(
  result1: Result<T1, E>,
  result2: Result<T2, E>,
): Result<[T1, T2], E> {
  if (result1.isErr()) {
    return result1;
  }
  if (result2.isErr()) {
    return result2;
  }
  return ok([result1.value, result2.value]);
}

export type { Result, AppError, User, Post, UserProfile };
export { Ok, Err, ok, err };
