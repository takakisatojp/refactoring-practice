// ❌ リファクタリング前: Optional フィールドで状態を表現（不完全）

interface User {
  id: string;
  name: string;
}

// 不完全なフィールド組み合わせ
interface RequestState {
  status: 'loading' | 'success' | 'error';
  data?: User; // loading 状態では不要、success では必須
  error?: string; // loading 状態では不要、error では必須
}

/**
 * API リクエストを実行する関数
 * 呼び出し側が各状態で何が使えるか理解する必要がある
 */
export async function fetchUser(userId: string): Promise<RequestState> {
  const state: RequestState = { status: 'loading' };

  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();

    if (response.ok) {
      return { status: 'success', data }; // error は undefined
    } else {
      return { status: 'error', error: data.message }; // data は undefined
    }
  } catch (err) {
    return {
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * 状態を処理する関数
 * status ごとに必要なフィールドを手動でチェック
 */
export function renderUserState(state: RequestState): string {
  if (state.status === 'loading') {
    return 'Loading...';
  }

  if (state.status === 'success') {
    // data があると仮定（実際にはないかもしれない）
    return `User: ${state.data?.name || 'Unknown'}`; // 不確実
  }

  if (state.status === 'error') {
    // error があると仮定（実際にはないかもしれない）
    return `Error: ${state.error || 'Unknown error'}`; // 不確実
  }

  return 'Unknown state';
}

/**
 * 矛盾した状態を作ることが可能（型チェックで防げない）
 */
export function createInconsistentState(): RequestState {
  return {
    status: 'success',
    data: { id: '1', name: 'John' },
    error: 'Something went wrong', // 矛盾！success なのに error がある
  };
}
