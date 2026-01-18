// ❌ リファクタリング前: エラー型が混在している

interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * ユーザー情報を取得する関数
 * 複数の種類のエラーが throw される可能性がある
 */
export async function fetchUserData(userId: string): Promise<User> {
  // ネットワークエラーが発生する可能性
  const response = await fetch(`/api/users/${userId}`);

  // HTTP エラー時は Error オブジェクトを throw
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP Error: ${response.status}`);
  }

  // JSON パース エラー（string が throw される場合もある）
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw 'Invalid content type'; // String エラー
  }

  // 型チェックエラー（任意の値が throw される）
  let data: any;
  try {
    data = await response.json();
  } catch (error) {
    throw error; // unknown 型
  }

  if (!data.id || !data.name || !data.email) {
    throw new Error('Invalid user data');
  }

  return data as User;
}

/**
 * エラーハンドリングの複雑さ
 */
export function logError(error: unknown): string {
  if (typeof error === 'string') {
    // String エラーの処理
    return `String error: ${error}`;
  } else if (error instanceof Error) {
    // Error オブジェクトの処理
    return `Error: ${error.message}`;
  } else if (error instanceof SyntaxError) {
    // SyntaxError の処理
    return `Parse error: ${error.message}`;
  } else {
    // その他の型の処理
    return `Unknown error: ${String(error)}`;
  }
}
