# 01: Early Return（早期リターン）

## 学習目標

このリファクタリング問題では以下を学びます：

- ✅ 深いネストを避けるための早期リターンの活用
- ✅ コードの読みやすさ向上
- ✅ ガード句（Guard Clause）パターンの理解

## 問題点

以下のコードは、複数の条件チェックがネストされており、読みにくくなっています：

```typescript
// bad.ts の概要
function validateUserInput(user: any) {
  if (user) {
    if (user.email) {
      if (user.email.includes('@')) {
        if (user.age > 0) {
          // ✅ 本来の処理はここ
          return { isValid: true, message: 'OK' };
        } else {
          return { isValid: false, message: 'Invalid age' };
        }
      } else {
        return { isValid: false, message: 'Invalid email' };
      }
    } else {
      return { isValid: false, message: 'Email required' };
    }
  } else {
    return { isValid: false, message: 'User required' };
  }
}
```

### 問題点
- 📌 深いネスト（4層）でコード全体が理解しにくい
- 📌 エラーハンドリングが本来の処理と混在している
- 📌 条件分岐の終わりが見にくい

## ゴール

早期リターン（Early Return）を使用して、以下を達成してください：

1. ✅ ネストを削減する（1～2層に）
2. ✅ エラーケースを最初に処理する
3. ✅ 本来の処理が明確に見える実装にする

## 制約条件

- ✅ `bad.ts` と同じ機能・動作を保つ
- ✅ すべてのテストが通るようにする
- ✅ TypeScript の型チェックに通る

## ヒント

💡 ヒントが必要な場合は、[HINTS.md](./HINTS.md) を確認してください。

## 次のステップ

1. `bad.ts` を読んで、現在のコードの問題を理解する
2. `npm test` でテストが通ることを確認
3. 自分で `good.ts` を作成してみる
4. `good.ts` と `EXPLANATION.md` で解法を確認

---

**難易度**: ⭐ Easy | **所要時間**: 10-15分
