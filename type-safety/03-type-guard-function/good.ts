// ✅ リファクタリング後: 型ガード関数で安全に型チェック

interface User {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  authorId: string;
}

/**
 * 型ガード関数: User かどうかを判定
 * 改善ポイント：
 * - `is User` で型ガード関数を宣言
 * - 複雑なチェック ロジックをカプセル化
 * - 呼び出し側で自動的に型が絞り込まれる
 */
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value &&
    typeof (value as Record<string, unknown>).id === 'string' &&
    typeof (value as Record<string, unknown>).name === 'string' &&
    typeof (value as Record<string, unknown>).email === 'string'
  );
}

/**
 * 型ガード関数: Post かどうかを判定
 */
function isPost(value: unknown): value is Post {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'authorId' in value &&
    typeof (value as Record<string, unknown>).id === 'string' &&
    typeof (value as Record<string, unknown>).title === 'string' &&
    typeof (value as Record<string, unknown>).authorId === 'string'
  );
}

/**
 * 型ガード関数を使ったコード
 * 改善ポイント：
 * - if で型ガード関数を呼び出すと、自動的に型が絞り込まれる
 * - as 型アサーションが不要
 * - コードが簡潔で読みやすい
 */
export function processApiResponse(data: unknown): void {
  if (isUser(data)) {
    // ここで data は User 型に絞り込まれている
    console.log(`User: ${data.name}`);
    return;
  }

  if (isPost(data)) {
    // ここで data は Post 型に絞り込まれている
    console.log(`Post: ${data.title}`);
    return;
  }

  console.log('Unknown data type');
}

/**
 * 配列をフィルタリング
 * 改善ポイント：
 * - filter と型ガード関数の組み合わせ
 * - 結果は自動的に User[] になる
 */
export function filterUsers(items: unknown[]): User[] {
  return items.filter(isUser);
}

/**
 * JSON をパース
 */
export function parseUserJson(json: string): User | null {
  try {
    const data = JSON.parse(json);
    return isUser(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * ヘルパー関数: 有効なメールアドレスかどうか
 */
function isValidEmail(email: string): boolean {
  return email.includes('@') && email.includes('.');
}

/**
 * より複雑な型ガード関数の例
 */
function isValidUser(value: unknown): value is User {
  return (
    isUser(value) &&
    value.id.length > 0 &&
    value.name.length > 0 &&
    isValidEmail(value.email)
  );
}

/**
 * union 型の判定
 */
type Content = User | Post | string;

function isUserContent(content: Content): content is User {
  return isUser(content);
}

function isPostContent(content: Content): content is Post {
  return isPost(content);
}

export function processContent(content: Content): void {
  if (isUserContent(content)) {
    console.log(`User content: ${content.name}`);
  } else if (isPostContent(content)) {
    console.log(`Post content: ${content.title}`);
  } else {
    console.log(`String content: ${content}`);
  }
}

/**
 * 型ガード関数を複数組み合わせる
 */
export function validateAndProcessUser(data: unknown): User | null {
  if (!isUser(data)) {
    return null;
  }

  if (!isValidUser(data)) {
    console.warn('User data is invalid');
    return null;
  }

  return data;
}

export type { User, Post, Content };
