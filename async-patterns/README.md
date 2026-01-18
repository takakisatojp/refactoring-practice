# Async Patterns（非同期処理パターン）

非同期処理の適切な実装と最適化を学びます。

## 📚 このトピックで学べること

- ✅ Promise チェーンの改善
- ✅ async/await の活用
- ✅ エラーハンドリングの統一
- ✅ 並行処理の実装
- ✅ リトライ・キャンセル処理
- ✅ AbortController の活用

## 📂 問題一覧

| # | 問題 | 難易度 | 説明 |
|---|------|--------|------|
| 01 | [Promise Chain](./01-promise-chain/) | ⭐ Easy | Promise チェーンを async/await へ |
| 02 | [Async/Await](./02-async-await/) | ⭐ Easy | async/await の正しい使用法 |
| 03 | [Error Handling Async](./03-error-handling-async/) | ⭐⭐ Medium | 非同期処理のエラーハンドリング |
| 04 | [Concurrent Processing](./04-concurrent-processing/) | ⭐⭐ Medium | Promise.all による並行処理 |
| 05 | [Retry Pattern](./05-retry-pattern/) | ⭐⭐ Medium | 指数バックオフ付きリトライ |
| 06 | [Cancellation](./06-cancellation/) | ⭐⭐⭐ Hard | AbortController によるキャンセル |

## 🎯 推奨学習順

1. **基礎**（Easy）
   - 01: Promise Chain - 基本の理解
   - 02: Async/Await - モダンな書き方

2. **実践**（Medium）
   - 03: Error Handling Async - エラー処理
   - 04: Concurrent Processing - 並行処理
   - 05: Retry Pattern - リトライロジック

3. **応用**（Hard）
   - 06: Cancellation - キャンセル処理

## 💡 学習ポイント

### Promise チェーンから async/await へ
```typescript
// ❌ Promise チェーン
function fetchUser(id: string) {
  return fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(data => formatUser(data))
    .catch(error => console.error(error));
}

// ✅ async/await
async function fetchUser(id: string) {
  try {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    return formatUser(data);
  } catch (error) {
    console.error(error);
  }
}
```

### エラーハンドリング
各非同期操作にエラーハンドリングを。

### 並行処理
```typescript
// 複数の非同期処理を並行実行
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
```

### リトライパターン
一時的な失敗に対して再試行。指数バックオフで待機時間を増やす。

### キャンセル処理
```typescript
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort(); // キャンセル
```

---

**ルートREADME**: [../README.md](../README.md)
