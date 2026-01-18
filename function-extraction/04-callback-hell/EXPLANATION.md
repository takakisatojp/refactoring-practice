# 詳細な解説

## Callback Hell（コールバック地獄）とは

複数の非同期操作をコールバックで繋ぐと、ネストが指数関数的に深くなる現象です。

```typescript
// Callback Hell の典型例
fetch(url1)
  .then(res1 => res1.json())
  .then(data1 => {
    fetch(url2)
      .then(res2 => res2.json())
      .then(data2 => {
        fetch(url3)
          .then(res3 => res3.json())
          .then(data3 => {
            // データ3を処理
          });
      });
  });
```

### 問題点
- ネストが深い
- エラーハンドリングが複雑
- 読みにくい
- 保守困難

---

## async/await による解決

### 基本的な形式

```typescript
async function fetchData() {
  const res1 = await fetch(url1);
  const data1 = await res1.json();

  const res2 = await fetch(url2);
  const data2 = await res2.json();

  const res3 = await fetch(url3);
  const data3 = await res3.json();

  return { data1, data2, data3 };
}
```

### メリット
- 直線的で読みやすい
- ネストなし
- 同期コードと同じ感覚

---

## エラーハンドリング

```typescript
async function fetchData() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed:', error);
    throw error;
  }
}
```

---

## 並行処理

複数の非同期操作を同時実行：

```typescript
// 順序実行（遅い）
const data1 = await fetch(url1).then(r => r.json());
const data2 = await fetch(url2).then(r => r.json());

// 並行実行（速い）
const [data1, data2] = await Promise.all([
  fetch(url1).then(r => r.json()),
  fetch(url2).then(r => r.json()),
]);
```

---

**参考**: async/await の詳細は async-patterns トピックで学びましょう。
