# 03: Result Pattern（Result型による安全なエラー処理）

## 学習目標

このリファクタリング問題では以下を学びます：

- ✅ Result型パターンの実装
- ✅ チェーンメソッドによる流暢なエラーハンドリング
- ✅ 関数型プログラミングの思想

## 問題点

エラーハンドリングで毎回 `if (isError(result))` をチェックするのは冗長です：

```typescript
// 何度も同じチェックが必要
const result1 = await fetchUser();
if (isError(result1)) return result1;

const result2 = await fetchPosts(result1.id);
if (isError(result2)) return result2;

const result3 = await formatData(result2);
if (isError(result3)) return result3;
```

### 問題点
- 📌 エラーチェックが重複
- 📌 ネストが増える可能性
- 📌 処理の流れが見にくい

## ゴール

Result型パターンを実装して、以下を達成してください：

1. ✅ `Ok<T>` / `Err<E>` 型を定義する
2. ✅ `map` / `flatMap` / `mapErr` メソッドを実装
3. ✅ チェーンメソッドで流暢に処理する

## 制約条件

- ✅ すべての機能を保つ
- ✅ TypeScript の型チェックに通る
- ✅ すべてのテストが通る

---

**難易度**: ⭐⭐ Medium | **所要時間**: 20-30分
