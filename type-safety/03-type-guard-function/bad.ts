// ❌ リファクタリング前: 毎回手動で型チェック

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
 * API から取得したデータを処理する関数
 * unknown 型から手動で型チェックして値を抽出
 */
export function processApiResponse(data: unknown): void {
  // ユーザーかどうか判定
  if (
    data &&
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'email' in data &&
    typeof (data as any).id === 'string' &&
    typeof (data as any).name === 'string' &&
    typeof (data as any).email === 'string'
  ) {
    // ここでも as any が必要
    const user = data as User;
    console.log(`User: ${user.name}`);
    return;
  }

  // ポストかどうか判定
  if (
    data &&
    typeof data === 'object' &&
    'id' in data &&
    'title' in data &&
    'authorId' in data &&
    typeof (data as any).id === 'string' &&
    typeof (data as any).title === 'string' &&
    typeof (data as any).authorId === 'string'
  ) {
    const post = data as Post;
    console.log(`Post: ${post.title}`);
    return;
  }

  console.log('Unknown data type');
}

/**
 * 配列をフィルタリングする際にも毎回チェックが必要
 */
export function filterUsers(items: unknown[]): User[] {
  return items.filter((item) => {
    return (
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'name' in item &&
      'email' in item &&
      typeof (item as any).id === 'string' &&
      typeof (item as any).name === 'string' &&
      typeof (item as any).email === 'string'
    );
  }) as User[];
}

/**
 * JSON を parse する際のエラーハンドリング
 */
export function parseUserJson(json: string): User | null {
  try {
    const data = JSON.parse(json);

    if (
      data &&
      typeof data === 'object' &&
      'id' in data &&
      'name' in data &&
      'email' in data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.email === 'string'
    ) {
      return data as User;
    }

    return null;
  } catch {
    return null;
  }
}
