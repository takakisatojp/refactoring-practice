// ✅ リファクタリング後: 配列メソッドで効率的に処理

interface User {
  id: string;
  name: string;
  age: number;
  active: boolean;
}

/**
 * メソッドチェーンで効率的に処理
 * 改善ポイント：
 * - ループが1回のみ
 * - 各ステップが明確
 * - 中間配列を生成しない（オプティマイザーがFus）
 */
export function processUsers(users: User[]): string[] {
  return users
    .filter((user) => user.active)
    .filter((user) => user.age >= 18)
    .map((user) => user.name)
    .filter((name) => name.length > 3);
}

/**
 * reduce を使った複雑な集約処理
 */
export function calculateUserStats(users: User[]): { total: number; average: number; min: number; max: number } {
  const filteredUsers = users.filter((user) => user.active && user.age >= 18);

  if (filteredUsers.length === 0) {
    return { total: 0, average: 0, min: 0, max: 0 };
  }

  const stats = filteredUsers.reduce(
    (acc, user) => ({
      total: acc.total + 1,
      sum: acc.sum + user.age,
      min: Math.min(acc.min, user.age),
      max: Math.max(acc.max, user.age),
    }),
    { total: 0, sum: 0, min: Infinity, max: -Infinity },
  );

  return {
    total: stats.total,
    average: stats.sum / stats.total,
    min: stats.min,
    max: stats.max,
  };
}

/**
 * ユーザーを年代別にグループ化
 */
export function groupUsersByAge(users: User[]): Record<string, User[]> {
  return users.reduce(
    (groups, user) => {
      const ageGroup = user.age < 30 ? 'under30' : user.age < 60 ? '30-60' : 'over60';
      if (!groups[ageGroup]) {
        groups[ageGroup] = [];
      }
      groups[ageGroup].push(user);
      return groups;
    },
    {} as Record<string, User[]>,
  );
}

/**
 * ユーザーごとにカウント
 */
export function countByName(users: User[]): Record<string, number> {
  return users.reduce(
    (counts, user) => ({
      ...counts,
      [user.name]: (counts[user.name] || 0) + 1,
    }),
    {} as Record<string, number>,
  );
}

export type { User };
