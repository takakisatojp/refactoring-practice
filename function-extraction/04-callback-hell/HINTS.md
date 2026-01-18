# ヒント集

## ヒント 1: Callback Hell の原因

複数の非同期操作をコールバックで繋ぐと、ネストが深くなります。

```typescript
// ❌ Callback Hell
fetch(...).then(res => {
  res.json().then(data => {
    fetch(...).then(res2 => {
      res2.json().then(data2 => {
        // ネストが深い...
      });
    });
  });
});
```

---

## ヒント 2: async/await で平坦化

```typescript
// ✅ async/await
const res = await fetch(...);
const data = await res.json();

const res2 = await fetch(...);
const data2 = await res2.json();

// 直線的で読みやすい
```

---

## ヒント 3: エラーハンドリング

```typescript
// try/catch で統一
try {
  const res = await fetch(...);
  const data = await res.json();
} catch (error) {
  // エラーハンドリング
}
```

---

**準備ができたら、`good.ts` を開いて比較しましょう。**
