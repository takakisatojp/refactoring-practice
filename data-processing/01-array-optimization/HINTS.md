# ヒント集

## ヒント 1: map/filter/reduce

```typescript
// map: 各要素を変換
users.map(u => u.name)

// filter: 条件を満たす要素を抽出
users.filter(u => u.active)

// reduce: 複数の値を1つに集約
users.reduce((sum, u) => sum + u.age, 0)
```

---

## ヒント 2: メソッドチェーン

```typescript
// ✅ 複数のメソッドをチェーン
users
  .filter(u => u.active)
  .filter(u => u.age >= 18)
  .map(u => u.name)
  .filter(name => name.length > 3)
```

---

## ヒント 3: reduce で集約

```typescript
// ✅ reduce で複雑な集約処理
const stats = users.reduce(
  (acc, user) => ({
    sum: acc.sum + user.age,
    min: Math.min(acc.min, user.age),
    max: Math.max(acc.max, user.age),
  }),
  { sum: 0, min: Infinity, max: -Infinity }
);
```

---

**準備ができたら、`good.ts` を開いて比較しましょう。**
