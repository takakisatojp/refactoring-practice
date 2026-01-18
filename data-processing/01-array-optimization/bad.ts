// ❌ リファクタリング前: 複数ループで非効率

interface User {
  id: string;
  name: string;
  age: number;
  active: boolean;
}

/**
 * 複数のループで配列を処理
 */
export function processUsers(users: User[]): string[] {
  // ループ 1: アクティブなユーザーをフィルタ
  const activeUsers: User[] = [];
  for (const user of users) {
    if (user.active) {
      activeUsers.push(user);
    }
  }

  // ループ 2: 成人ユーザーをフィルタ
  const adultUsers: User[] = [];
  for (const user of activeUsers) {
    if (user.age >= 18) {
      adultUsers.push(user);
    }
  }

  // ループ 3: 名前を抽出
  const names: string[] = [];
  for (const user of adultUsers) {
    names.push(user.name);
  }

  // ループ 4: 長い名前でフィルタ
  const longNames: string[] = [];
  for (const name of names) {
    if (name.length > 3) {
      longNames.push(name);
    }
  }

  return longNames;
}

/**
 * 複雑な条件を手動ループで処理
 */
export function calculateUserStats(users: User[]): { total: number; average: number; min: number; max: number } {
  let totalAge = 0;
  let count = 0;
  let minAge = Infinity;
  let maxAge = -Infinity;

  for (const user of users) {
    if (user.active && user.age >= 18) {
      totalAge += user.age;
      count++;
      if (user.age < minAge) minAge = user.age;
      if (user.age > maxAge) maxAge = user.age;
    }
  }

  return {
    total: count,
    average: count > 0 ? totalAge / count : 0,
    min: minAge === Infinity ? 0 : minAge,
    max: maxAge === -Infinity ? 0 : maxAge,
  };
}
