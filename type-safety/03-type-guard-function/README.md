# 03: Type Guard Function（型ガード関数）

## 学習目標

- ✅ 型ガード関数の実装（`is` キーワード）
- ✅ 型安全な型チェック
- ✅ unknown 型の安全な処理

## 問題点

`unknown` または `any` 型から安全に値を抽出する場合、毎回手動で型チェックを書くのは冗長です：

```typescript
function processData(data: unknown) {
  // 毎回このようなチェックが必要
  if (data && typeof data === 'object' && 'name' in data) {
    // ここでも依然として data は object 型
    console.log(data.name); // ❌ エラー
  }
}
```

## ゴール

型ガード関数を実装して、以下を達成してください：

1. ✅ `is` キーワードを使った型ガード関数を定義
2. ✅ 複雑な型チェックを関数化
3. ✅ 型安全に値を絞り込む

---

**難易度**: ⭐⭐ Medium | **所要時間**: 20-25分
