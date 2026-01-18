# 詳細な解説

## 問題の背景

実務では、複数の異なる種類のエラーが発生します：

- **ネットワークエラー**: 接続失敗、タイムアウト
- **HTTPエラー**: 4xx, 5xx ステータスコード
- **パースエラー**: JSON 無効、エンコーディング問題
- **ビジネスロジックエラー**: 検証失敗、権限不足

これらを異なる方法で throw すると、呼び出し側のエラーハンドリングが複雑になります。

---

## 改善前の問題点

### 1. エラー型の混在

```typescript
// bad.ts での throw パターン
throw new Error(...);           // Error オブジェクト
throw 'Invalid content type';   // String
throw error;                    // unknown
```

### 2. 呼び出し側の複雑なエラー処理

```typescript
catch (error) {
  if (typeof error === 'string') {
    // String エラーの処理
  } else if (error instanceof Error) {
    // Error オブジェクトの処理
  } else if (error instanceof SyntaxError) {
    // SyntaxError の処理
  } else {
    // その他
  }
}
```

### 3. エラーの詳細情報の喪失

```typescript
// HTTPエラーの詳細（ステータスコード）が失われる
throw new Error(`HTTP Error: ${response.status}`);
// → "HTTP Error: 404" という文字列になってしまう
// → ステータスコードを抽出するのが困難
```

---

## 解決策: Union型での統一

### 基本的な考え方

```typescript
// すべてのエラーを AppError 型で表現
type AppError =
  | { type: 'NetworkError'; message: string }
  | { type: 'HTTPError'; status: number; message: string }
  | { type: 'ParseError'; message: string }
  | { type: 'ValidationError'; message: string };
```

**メリット**
- 全て同じ型（AppError）
- `type` フィールドでエラーを区別（判別可能な Union）
- エラー固有の情報を構造化

### 改善されたコード

**戻り値型の統一**

```typescript
// 改善前: エラーが throw される
export async function fetchUserData(userId: string): Promise<User> {
  // throw が発生する可能性がある
}

// 改善後: エラーを戻り値で返す
export async function fetchUserData(userId: string): Promise<User | AppError> {
  // エラーを値として返す
  // throw しない
}
```

**エラーハンドリングの簡潔化**

```typescript
// 改善前
try {
  const user = await fetchUserData('123');
  // ...
} catch (error) {
  if (typeof error === 'string') {
    // ...
  } else if (error instanceof Error) {
    // ...
  }
}

// 改善後
const result = await fetchUserData('123');

if (isError(result)) {
  // result は AppError 型
  switch (result.type) {
    case 'NetworkError':
      // ...
      break;
    case 'HTTPError':
      // ...
      break;
    // ...
  }
} else {
  // result は User 型
  console.log(result.name);
}
```

---

## Discriminated Union（判別可能な Union）

### パターンの説明

```typescript
type Result =
  | { type: 'success'; data: User }
  | { type: 'error'; code: string; message: string };

// type フィールドで Union の型が自動的に絞り込まれる
function process(result: Result) {
  if (result.type === 'success') {
    // ここで result は { type: 'success'; data: User }
    console.log(result.data.name);
  } else {
    // ここで result は { type: 'error'; code: string; ... }
    console.log(result.code);
  }
}
```

### なぜ重要か

1. **型安全**: 各エラー型に固有の情報を持つ
2. **自動型絞り込み**: if/switch で型が狭まる
3. **Exhaustiveness チェック**: 未処理のケースをコンパイル時に検出

---

## 実務での応用パターン

### パターン 1: Promise を使う

```typescript
// エラーを値として返す（throw しない）
async function fetchData(): Promise<Data | AppError> {
  // ...
}

// 呼び出し側
const result = await fetchData();
if (isError(result)) {
  // エラー処理
}
```

### パターン 2: Result 型パターン

```typescript
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// または

type Result<T, E> = { type: 'Ok'; value: T } | { type: 'Err'; error: E };
```

### パターン 3: Either 型パターン（関数型）

```typescript
type Either<L, R> = { tag: 'Left'; left: L } | { tag: 'Right'; right: R };
```

---

## 型ガード関数の活用

### isError 関数

```typescript
export function isError(result: User | AppError): result is AppError {
  return (
    typeof result === 'object' &&
    result !== null &&
    'type' in result &&
    'message' in result
  );
}

// 使用例
const result = await fetchUserData('123');

if (isError(result)) {
  // result は AppError 型
  logError(result);
} else {
  // result は User 型
  console.log(result.name);
}
```

### Exhaustiveness Check

```typescript
function logError(error: AppError): string {
  switch (error.type) {
    case 'NetworkError':
      return `Network: ${error.message}`;
    case 'HTTPError':
      return `HTTP ${error.status}: ${error.message}`;
    case 'ParseError':
      return `Parse: ${error.message}`;
    case 'ValidationError':
      return `Validation: ${error.message}`;
    default:
      // 新しいエラーを追加すると、ここでエラーが出る
      const _exhaustive: never = error;
      return String(_exhaustive);
  }
}
```

---

## メリット・デメリット

### メリット

| 項目 | 効果 |
|------|------|
| **型安全性** | すべてのエラーが型チェック対象 |
| **エラー情報** | 各エラーに固有の詳細情報を保持 |
| **処理の統一** | すべてのエラーを同じ方法で処理 |
| **保守性** | エラーの追加・変更が簡単 |
| **デバッグ** | エラーの種類が明確で、ログが見やすい |

### デメリット

| 項目 | 対応 |
|------|------|
| **スタックトレースの喪失** | 必要に応れば error オブジェクトを保持 |
| **コード量の増加** | Union型の定義が必要 |
| **学習曲線** | TypeScript の型システムの理解が必要 |

---

## 関連パターン

### 1. **Union型によるエラー表現** （このレッスン）
複数のエラー型を統一

### 2. **Result 型パターン** （次々のレッスン）
関数型プログラミング的なアプローチ

### 3. **Error Boundary** （React）
コンポーネントツリー内のエラーハンドリング

---

## 参考資料

### TypeScript
- [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

### リファクタリング
- [Refactoring.Guru: Replace Error Code with Exception](https://refactoring.guru/replace-error-code-with-exception)

### 関数型プログラミング
- [Rust's Result type](https://doc.rust-lang.org/std/result/)
- [Railway-oriented programming](https://fsharpforfunandprofit.com/rop/)

---

**次のステップ**: 03-result-pattern へ進んで、より関数型的なエラーハンドリングを学びましょう。
