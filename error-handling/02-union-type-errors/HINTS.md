# ヒント集

## ヒント 1: Union型の定義

**💡 考え方**

エラーの種類を明示的に定義するために、Union型を使用します。

```typescript
// エラーの種類ごとに、type フィールドで区別
type AppError =
  | { type: 'NetworkError'; message: string }
  | { type: 'HTTPError'; status: number; message: string }
  | { type: 'ParseError'; message: string }
  | { type: 'ValidationError'; message: string };
```

**ポイント**
- `type` フィールドでエラーの種類を区別（Discriminated Union）
- 各エラーに必要な追加情報を含める
  - HTTPError → `status` コード
  - ネットワークエラー → なし
  - ParseError → `message` のみ

---

## ヒント 2: エラー判定の改善

**💡 従来の方法（悪い）**

```typescript
// 複数の instanceof や typeof チェックが必要
if (typeof error === 'string') {
  // String エラー
} else if (error instanceof Error) {
  // Error オブジェクト
} else if (error instanceof SyntaxError) {
  // SyntaxError
} else {
  // その他
}
```

**改善方法**

```typescript
// Union型を使用すれば、type フィールドで区別
if (error.type === 'NetworkError') {
  // ネットワークエラー
} else if (error.type === 'HTTPError') {
  // HTTPエラー（status を使用可能）
} else if (error.type === 'ParseError') {
  // パースエラー
} else if (error.type === 'ValidationError') {
  // 検証エラー
}
```

---

## ヒント 3: 戻り値の型を統一

**💡 従来の方法（悪い）**

```typescript
async function fetch data() {
  if (error1) throw new Error(...);
  if (error2) throw 'error message'; // string!
  if (error3) throw error; // unknown!
}
```

呼び出し側：
```typescript
try {
  const data = await fetchData();
} catch (error) {
  // error は unknown 型
  // 複雑なエラー処理が必要
}
```

**改善方法**

```typescript
async function fetchData(): Promise<Data | AppError> {
  if (error1) {
    return { type: 'NetworkError', message: ... };
  }
  if (error2) {
    return { type: 'ParseError', message: ... };
  }
  return data; // 正常系
}
```

呼び出し側：
```typescript
const result = await fetchData();

if (isError(result)) {
  // result は AppError 型
  // 型安全に処理できる
} else {
  // result は Data 型
}
```

---

## 実装のコツ

### 1. 型ガード関数を作成

```typescript
function isError(result: Data | AppError): result is AppError {
  return typeof result === 'object' && 'type' in result;
}

// 使用例
const result = await fetchData();
if (isError(result)) {
  // ここでは result は AppError 型
  console.log(result.type);
} else {
  // ここでは result は Data 型
  console.log(result.id);
}
```

### 2. Exhaustiveness Check

TypeScriptの型システムで未処理のケースを検出：

```typescript
function handle(error: AppError): string {
  switch (error.type) {
    case 'NetworkError':
      return `Network: ${error.message}`;
    case 'HTTPError':
      return `HTTP ${error.status}`;
    case 'ParseError':
      return `Parse: ${error.message}`;
    case 'ValidationError':
      return `Validation: ${error.message}`;
    // もし新しいエラーを追加すると、ここでエラーが出る
    default:
      const _exhaustive: never = error;
      return String(_exhaustive);
  }
}
```

### 3. 各エラー種別を適切に返す

```typescript
// ネットワークエラー
try {
  const response = await fetch(url);
} catch (error) {
  return {
    type: 'NetworkError',
    message: error instanceof Error ? error.message : 'Network error',
  };
}

// HTTPエラー
if (!response.ok) {
  return {
    type: 'HTTPError',
    status: response.status,
    message: getMessageForStatus(response.status),
  };
}

// パースエラー
try {
  const data = await response.json();
} catch (error) {
  return {
    type: 'ParseError',
    message: error instanceof Error ? error.message : 'Parse error',
  };
}
```

---

## テストで動作確認

実装後、テストで動作確認しましょう：

```bash
npm test error-handling/02-union-type-errors/test.test.ts
```

各エラーの種類でテストが通るか確認してください。

---

**準備ができたら、`good.ts` を開いて比較しましょう。**
