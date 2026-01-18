// ✅ リファクタリング後: Discriminated Union で状態を明確に

interface User {
  id: string;
  name: string;
}

/**
 * 各状態を個別の型で定義
 * 改善ポイント：
 * - type フィールドで Union の型が自動的に絞り込まれる
 * - 各状態ごとに必要なフィールドのみを持つ
 * - 矛盾した状態が作れない
 */
type RequestState =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

/**
 * API リクエストを実行する関数
 */
export async function fetchUser(userId: string): Promise<RequestState> {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      return {
        status: 'error',
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      status: 'success',
      data,
    };
  } catch (err) {
    return {
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * 状態を処理する関数
 * 改善ポイント：
 * - switch で type narrowing が効く
 * - 各ケースで必要なフィールドのみ使える
 * - TypeScript が未処理のケースを検出
 */
export function renderUserState(state: RequestState): string {
  switch (state.status) {
    case 'loading':
      // ここで state は { status: 'loading' }
      return 'Loading...';

    case 'success':
      // ここで state は { status: 'success'; data: User }
      // data は必ず存在（？を付けなくて良い）
      return `User: ${state.data.name}`;

    case 'error':
      // ここで state は { status: 'error'; error: string }
      // error は必ず存在
      return `Error: ${state.error}`;

    default:
      // TypeScript: 未処理のケースをコンパイル時に検出
      const _exhaustive: never = state;
      return String(_exhaustive);
  }
}

/**
 * 状態に応じた処理を実行する
 */
export function handleState(state: RequestState): void {
  if (state.status === 'loading') {
    // state は { status: 'loading' }
    console.log('Request in progress...');
    return;
  }

  if (state.status === 'success') {
    // state は { status: 'success'; data: User }
    console.log(`Loaded user: ${state.data.name}`);
    return;
  }

  if (state.status === 'error') {
    // state は { status: 'error'; error: string }
    console.error(`Failed to load: ${state.error}`);
    return;
  }

  // unreachable
  const _: never = state;
}

/**
 * 矛盾した状態が作れない（コンパイルエラー）
 * 下記のコードはコンパイルエラーになります：
 *
 * const bad: RequestState = {
 *   status: 'success',
 *   data: { id: '1', name: 'John' },
 *   error: 'Something went wrong', // ❌ コンパイルエラー
 * };
 */

/**
 * 状態の遷移を管理する
 */
export class UserLoader {
  state: RequestState = { status: 'loading' };

  async load(userId: string): Promise<void> {
    this.state = { status: 'loading' };

    const newState = await fetchUser(userId);
    this.state = newState;
  }

  render(): string {
    return renderUserState(this.state);
  }

  /**
   * 各状態で異なる操作を提供
   */
  canRetry(): boolean {
    return this.state.status === 'error';
  }

  getUserData(): User | null {
    if (this.state.status === 'success') {
      return this.state.data;
    }
    return null;
  }

  getError(): string | null {
    if (this.state.status === 'error') {
      return this.state.error;
    }
    return null;
  }
}

export type { RequestState };
