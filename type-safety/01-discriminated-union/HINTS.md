# ヒント集

## ヒント 1: 状態の分離

**💡 考え方**

異なる状態では必要な情報が異なります。これを型で表現します。

```typescript
// ❌ 悪い例（Optional フィールド）
type RequestState = {
  status: 'loading' | 'success' | 'error';
  data?: User;
  error?: string;
};

// ✅ 良い例（分離した Union）
type RequestState =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };
```

**ポイント**
- loading 時：データもエラーも不要
- success 時：data は必須、error は不要
- error 時：error は必須、data は不要

---

## ヒント 2: Type Narrowing

**💡 考え方**

status を確認すると、TypeScript が自動的に型を絞り込みます。

```typescript
function handle(state: RequestState) {
  if (state.status === 'loading') {
    // 自動的に { status: 'loading' } に絞られる
    // data や error フィールドは存在しない
  }

  if (state.status === 'success') {
    // 自動的に { status: 'success'; data: User } に絞られる
    console.log(state.data.name); // ✅ 安全
  }

  if (state.status === 'error') {
    // 自動的に { status: 'error'; error: string } に絞られる
    console.log(state.error); // ✅ 安全
  }
}
```

**メリット**
- 各分岐で安全にフィールドにアクセス可能
- `?.` や `!` が不要
- 型チェック時に矛盾を検出

---

## ヒント 3: Switch による Exhaustiveness Check

**💡 考え方**

switch 文で Discriminated Union を処理すると、未処理のケースをコンパイル時に検出します。

```typescript
function render(state: RequestState): string {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `User: ${state.data.name}`;
    case 'error':
      return `Error: ${state.error}`;
    default:
      // 新しい status を追加すると、ここでエラー
      const _exhaustive: never = state;
      return String(_exhaustive);
  }
}
```

**メリット**
- 新しい状態を追加したとき、必ず switch に追加させる
- 不完全な処理を型レベルで防止

---

## 実装のコツ

### 1. 各状態で共通のフィールドのみ

```typescript
// ✅ 良い例
type State =
  | { type: 'loading' }
  | { type: 'ready'; data: T }
  | { type: 'error'; error: Error };

// ❌ 悪い例（余分なフィールド）
type State =
  | { type: 'loading'; data?: T; error?: Error }
  | { type: 'ready'; data: T; error?: Error }
  | { type: 'error'; data?: T; error: Error };
```

### 2. discriminator フィールドは明示的に

```typescript
// Discriminator フィールド名を統一
type State =
  | { status: 'loading' }
  | { status: 'success'; value: T }
  | { status: 'failure'; reason: E };

// 処理時に一貫性がある
if (state.status === 'loading') { ... }
```

### 3. 複雑な状態は入れ子に

```typescript
type RequestState =
  | { status: 'idle' }
  | {
      status: 'pending';
      uploadProgress: number;
      estimatedTime: number;
    }
  | { status: 'success'; result: T }
  | { status: 'error'; code: number; message: string };
```

---

## テストで動作確認

実装後、テストで動作確認しましょう：

```bash
npm test type-safety/01-discriminated-union/test.test.ts
```

各状態の型チェックと処理が正しく動作するか確認してください。

---

**準備ができたら、`good.ts` を開いて比較しましょう。**
