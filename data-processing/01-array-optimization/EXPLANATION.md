# 詳細な解説

## 配列操作の問題

複数ループで配列処理するのは非効率です：

```typescript
const activeUsers = users.filter(u => u.active);
const adultUsers = activeUsers.filter(u => u.age >= 18);
const names = adultUsers.map(u => u.name);
const longNames = names.filter(n => n.length > 3);
```

### 問題点
- 中間配列が生成される
- メモリ効率が悪い
- 可読性が低い

---

## 改善方法

### メソッドチェーン

```typescript
users
  .filter(u => u.active)
  .filter(u => u.age >= 18)
  .map(u => u.name)
  .filter(n => n.length > 3)
```

### メリット
- ループが1回（最適化の余地がある）
- 直線的で読みやすい
- パフォーマンスが良い

---

## reduce での集約処理

複数の情報を集約する場合：

```typescript
const stats = users.reduce(
  (acc, user) => ({
    count: acc.count + 1,
    sum: acc.sum + user.age,
    min: Math.min(acc.min, user.age),
    max: Math.max(acc.max, user.age),
  }),
  { count: 0, sum: 0, min: Infinity, max: -Infinity }
);
```

---

**参考**: MDN - [Array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
