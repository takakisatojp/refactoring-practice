// ✅ リファクタリング後: Union型でエラーを統一

interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * エラーの種類を明示的に定義する
 * 各エラーは固有の情報を持つ
 */
type AppError =
  | { type: 'NetworkError'; message: string }
  | { type: 'HTTPError'; status: number; message: string }
  | { type: 'ParseError'; message: string }
  | { type: 'ValidationError'; message: string };

/**
 * ユーザー情報を取得する関数
 * 改善ポイント：
 * - すべてのエラーを AppError の Union型で返す
 * - エラーの種類が明確
 * - 呼び出し側でエラー処理が簡潔
 */
export async function fetchUserData(userId: string): Promise<User | AppError> {
  try {
    // ネットワークエラーをキャッチ
    let response: Response;
    try {
      response = await fetch(`/api/users/${userId}`);
    } catch (error) {
      return {
        type: 'NetworkError',
        message: error instanceof Error ? error.message : 'Network request failed',
      };
    }

    // HTTPエラーをチェック
    if (!response.ok) {
      return {
        type: 'HTTPError',
        status: response.status,
        message: getHTTPErrorMessage(response.status),
      };
    }

    // Content-Type をチェック
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        type: 'ParseError',
        message: 'Invalid content type',
      };
    }

    // JSON をパース
    let data: unknown;
    try {
      data = await response.json();
    } catch (error) {
      return {
        type: 'ParseError',
        message: error instanceof Error ? error.message : 'Failed to parse JSON',
      };
    }

    // データを検証
    const validation = validateUser(data);
    if (!validation.isValid) {
      return {
        type: 'ValidationError',
        message: validation.error,
      };
    }

    return data as User;
  } catch (error) {
    // 予期しないエラー
    return {
      type: 'ValidationError',
      message: 'Unexpected error occurred',
    };
  }
}

/**
 * HTTPエラーメッセージを取得
 */
function getHTTPErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'User not found',
    500: 'Internal server error',
    503: 'Service unavailable',
  };
  return messages[status] || `HTTP Error: ${status}`;
}

/**
 * ユーザーデータの検証
 */
function validateUser(data: unknown): { isValid: boolean; error?: string } {
  if (typeof data !== 'object' || data === null) {
    return { isValid: false, error: 'Data must be an object' };
  }

  const obj = data as Record<string, unknown>;

  if (!obj.id || typeof obj.id !== 'string') {
    return { isValid: false, error: 'User ID is required and must be a string' };
  }

  if (!obj.name || typeof obj.name !== 'string') {
    return { isValid: false, error: 'User name is required and must be a string' };
  }

  if (!obj.email || typeof obj.email !== 'string') {
    return { isValid: false, error: 'User email is required and must be a string' };
  }

  return { isValid: true };
}

/**
 * エラーハンドリングが簡潔になった
 * 改善ポイント：
 * - エラーの型が明確
 * - switch文で各エラーを処理
 * - 型安全（type narrowing）
 */
export function logError(error: AppError): string {
  switch (error.type) {
    case 'NetworkError':
      return `🌐 Network Error: ${error.message}`;
    case 'HTTPError':
      return `❌ HTTP ${error.status}: ${error.message}`;
    case 'ParseError':
      return `📄 Parse Error: ${error.message}`;
    case 'ValidationError':
      return `⚠️ Validation Error: ${error.message}`;
    default:
      // TypeScript の型チェックが未処理のケースを検出
      const _exhaustive: never = error;
      return String(_exhaustive);
  }
}

/**
 * エラーかどうかを判定する型ガード関数
 */
export function isError(result: User | AppError): result is AppError {
  return typeof result === 'object' && result !== null && 'type' in result && 'message' in result;
}
