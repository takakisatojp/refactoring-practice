# 02: Union Type Errors（複数のエラー型を統一）

## 学習目標

このリファクタリング問題では以下を学びます：

- ✅ 複数の異なるエラー型を Union型で統一
- ✅ 型安全なエラーハンドリング
- ✅ エラーの種類に応じた適切な処理

## 問題点

APIからの応答やファイル操作など、複数の種類のエラーが発生する場合、異なる型で返されることがあります：

```typescript
// 複数の異なるエラー型が混在
function fetchUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      // HTTPエラーは Error 型
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // エラーが Error か string か unknown か不明確
    if (typeof error === 'string') {
      console.error('String error:', error);
    } else if (error instanceof Error) {
      console.error('Error object:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}
```

### 問題点
- 📌 エラーの型が一定でない
- 📌 エラーハンドリングが複雑
- 📌 新しいエラーの種類を追加しにくい

## ゴール

Union型を使用して、複数のエラー型を統一し、以下を達成してください：

1. ✅ エラーの種類を明示的に定義する
2. ✅ 各エラーに必要な情報を含める
3. ✅ エラーハンドリングを簡潔にする

## 制約条件

- ✅ すべての機能を保つ
- ✅ TypeScript の型チェックに通る
- ✅ すべてのテストが通る

---

**難易度**: ⭐ Easy | **所要時間**: 15-20分
