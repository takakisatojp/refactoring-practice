# Function Extraction（関数抽出）

関数の適切な分割と抽象化により、可読性と再利用性を高めます。

## 📚 このトピックで学べること

- ✅ 長い関数の分割
- ✅ 単一責任の原則
- ✅ 適切な抽象度の関数設計
- ✅ コールバック地獄の解消
- ✅ 高階関数の活用
- ✅ 関数合成

## 📂 問題一覧

| # | 問題 | 難易度 | 説明 |
|---|------|--------|------|
| 01 | [Long Function Split](./01-long-function-split/) | ⭐ Easy | 長い関数を複数の関数に分割 |
| 02 | [Single Responsibility](./02-single-responsibility/) | ⭐ Easy | 1つの関数 = 1つの責務 |
| 03 | [Function Abstraction](./03-function-abstraction/) | ⭐⭐ Medium | 適切な抽象度の関数設計 |
| 04 | [Callback Hell](./04-callback-hell/) | ⭐⭐ Medium | ネストされたコールバックの整理 |
| 05 | [Higher Order Function](./05-higher-order-function/) | ⭐⭐ Medium | 関数を受け取る・返す関数 |
| 06 | [Composition](./06-composition/) | ⭐⭐ Medium | 関数合成による処理パイプ |
| 07 | [Pipeline Pattern](./07-pipeline/) | ⭐⭐⭐ Hard | 複数の処理をパイプラインに |

## 🎯 推奨学習順

1. **基礎**（Easy）
   - 01: Long Function Split - 関数の分割
   - 02: Single Responsibility - 責務の分離

2. **実践**（Medium）
   - 03: Function Abstraction - 適切な抽象化
   - 04: Callback Hell - 非同期処理の整理
   - 05: Higher Order Function - 高階関数
   - 06: Composition - 関数合成

3. **応用**（Hard）
   - 07: Pipeline - 処理パイプラインの構築

## 💡 学習ポイント

### SRP（単一責任の原則）
1つの関数は1つのことだけをする。

### 関数の粒度
- 大きすぎない（テストしやすく、再利用しやすく）
- 小さすぎない（概念レベルの機能を持つ）

### 高階関数
```typescript
// 関数を受け取り、関数を返す
const withLogging = (fn: Function) => (...args: any[]) => {
  console.log(args);
  return fn(...args);
};
```

### 関数合成
複数の関数を組み合わせて新しい処理フローを作成。

---

**ルートREADME**: [../README.md](../README.md)
