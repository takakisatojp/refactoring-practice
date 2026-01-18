# Error Handling（エラーハンドリング）

エラーハンドリングの適切な設計と実装パターンを学びます。

## 📚 このトピックで学べること

- ✅ 早期リターンによるネストの削減
- ✅ Union型によるエラー表現
- ✅ Result型パターンの実装
- ✅ エラーバウンダリの設計
- ✅ エラーの責務分離
- ✅ エラーリカバリーパターン
- ✅ エラーログの適切な実装

## 📂 問題一覧

| # | 問題 | 難易度 | 説明 |
|---|------|--------|------|
| 01 | [Early Return](./01-early-return/) | ⭐ Easy | ネストされた if 文を早期リターンで簡潔に |
| 02 | [Union Type Errors](./02-union-type-errors/) | ⭐ Easy | 複数のエラー型を Union で統一 |
| 03 | [Result Pattern](./03-result-pattern/) | ⭐ Medium | Result 型による型安全なエラー処理 |
| 04 | [Error Boundary](./04-error-boundary/) | ⭐⭐ Medium | React コンポーネントのエラーハンドリング |
| 05 | [Error Responsibility](./05-error-responsibility/) | ⭐⭐ Medium | エラーハンドリングの責務分離 |
| 06 | [Nested Try-Catch](./06-nested-try-catch/) | ⭐⭐ Medium | ネストされた try-catch の整理 |
| 07 | [Error Recovery](./07-error-recovery/) | ⭐⭐⭐ Hard | エラーリカバリーパターンの実装 |
| 08 | [Error Logging](./08-error-logging/) | ⭐⭐⭐ Hard | 構造化ログによるエラー管理 |

## 🎯 推奨学習順

1. **基礎**（Easy）
   - 01: Early Return - if ネストの削減
   - 02: Union Type - 複数エラーの統一

2. **実践**（Medium）
   - 03: Result Pattern - 関数型のエラー処理
   - 04: Error Boundary - React での実装
   - 05: Error Responsibility - 責務分離

3. **応用**（Hard）
   - 06: Nested Try-Catch - 複雑なエラー処理
   - 07: Error Recovery - リトライ・フォールバック
   - 08: Error Logging - 構造化ログ

## 💡 学習ポイント

### Early Return パターン
深いネストを避け、例外ケースを先に処理する。

### Union型でのエラー表現
`Result<T, E> = Success<T> | Failure<E>` の形で型安全に。

### Error Boundary（React）
コンポーネントツリー内のエラーをキャッチして UI の崩壊を防ぐ。

### エラー責務の分離
ネットワークエラー、ビジネスロジックエラー、UI エラーなどを分離。

---

**ルートREADME**: [../../README.md](../README.md)
