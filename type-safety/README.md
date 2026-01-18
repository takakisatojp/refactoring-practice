# Type Safety（型安全性）

TypeScript の型システムを活用した安全で堅牢なコード設計を学びます。

## 📚 このトピックで学べること

- ✅ Discriminated Union 型の活用
- ✅ 戻り値の型を明示化
- ✅ 型ガード関数の実装
- ✅ 型アサーションの削減
- ✅ Generic 型の活用
- ✅ Conditional 型による型推論
- ✅ Strict null チェック

## 📂 問題一覧

| # | 問題 | 難易度 | 説明 |
|---|------|--------|------|
| 01 | [Discriminated Union](./01-discriminated-union/) | ⭐ Easy | Union 型を tagged で区別 |
| 02 | [Explicit Return Type](./02-explicit-return-type/) | ⭐ Easy | 関数の戻り値型を明示 |
| 03 | [Type Guard Function](./03-type-guard-function/) | ⭐ Medium | 型ガード関数で型の絞込み |
| 04 | [Type Assertion](./04-type-assertion/) | ⭐⭐ Medium | as の削減と適切な型推論 |
| 05 | [Generic Type](./05-generic-type/) | ⭐⭐ Medium | Generic で再利用可能な型設計 |
| 06 | [Strict Null Check](./06-strict-null-check/) | ⭐⭐ Medium | null/undefined の安全な処理 |
| 07 | [Conditional Type](./07-conditional-type/) | ⭐⭐⭐ Hard | 条件付き型による高度な型推論 |

## 🎯 推奨学習順

1. **基礎**（Easy）
   - 01: Discriminated Union - Union 型の区別
   - 02: Explicit Return Type - 型の明示化

2. **実践**（Medium）
   - 03: Type Guard - 型安全な絞込み
   - 04: Type Assertion - as の適切な使用
   - 05: Generic - 再利用可能な型
   - 06: Strict Null - null safe programming

3. **応用**（Hard）
   - 07: Conditional Type - 高度な型操作

## 💡 学習ポイント

### Discriminated Union（判別可能な Union）
`type Result = { status: 'success'; data: T } | { status: 'error'; error: E }`

### 型ガード関数
```typescript
function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result.status === 'success';
}
```

### Generic 型
型パラメータで異なる型の処理を統一化。

### Strict Null Check
`--strictNullChecks` で null/undefined を型レベルで管理。

---

**ルートREADME**: [../README.md](../README.md)
