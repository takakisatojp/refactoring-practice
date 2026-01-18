# 詳細な解説

## 問題の背景

API レスポンスなど、複数の状態を表現する場合、Optional フィールドの組み合わせだけでは不十分です。

```typescript
// 改善前
type RequestState = {
  status: 'loading' | 'success' | 'error';
  data?: User;
  error?: string;
};

// 問題
const invalid: RequestState = {
  status: 'success',
  data: user,
  error: 'Something failed', // 矛盾している！
};
```

---

## Discriminated Union（判別可能な Union）

### 基本的な考え方

```typescript
type Result =
  | { kind: 'success'; value: string }
  | { kind: 'error'; error: Error };

// kind フィールドで Union の型が自動的に絞り込まれる
function process(result: Result) {
  if (result.kind === 'success') {
    console.log(result.value); // ✅ value は絶対存在
  } else {
    console.log(result.error); // ✅ error は絶対存在
  }
}
```

### 実装例

```typescript
type RequestState =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };
```

**特徴**
- 各状態が個別の型
- discriminator（status）で型を区別
- 各状態に必要なフィールドのみを持つ

---

## メリット

### 1. 矛盾した状態が作れない

```typescript
// ✅ コンパイル成功
const success: RequestState = {
  status: 'success',
  data: { id: '1', name: 'John' },
};

// ❌ コンパイルエラー
const invalid: RequestState = {
  status: 'success',
  error: 'Something failed',
};
```

### 2. 型安全なアクセス

```typescript
function handle(state: RequestState) {
  if (state.status === 'success') {
    // ここで state は { status: 'success'; data: User }
    console.log(state.data.name); // ✅ 型安全
    // console.log(state.error); // ❌ コンパイルエラー
  }
}
```

### 3. Exhaustiveness Check

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
      // 新しい status を追加しないと、ここでエラー
      const _exhaustive: never = state;
      return String(_exhaustive);
  }
}
```

新しい状態を追加した場合：
```typescript
type RequestState =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string }
  | { status: 'retry'; attempt: number }; // 追加

// switch に対応を追加していないと、コンパイルエラー
// const _exhaustive: never = state; // ❌ never に代入できない
```

---

## 実務でのパターン

### パターン 1: API レスポンス

```typescript
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);

  if (response.ok) {
    return { ok: true, data: await response.json() };
  } else {
    return {
      ok: false,
      status: response.status,
      error: response.statusText,
    };
  }
}
```

### パターン 2: ステートマシン

```typescript
type OrderState =
  | { phase: 'pending'; createdAt: Date }
  | { phase: 'confirmed'; confirmedAt: Date; confirmId: string }
  | { phase: 'shipped'; trackingNumber: string; shippedAt: Date }
  | { phase: 'delivered'; deliveredAt: Date }
  | { phase: 'cancelled'; reason: string; cancelledAt: Date };

function canShip(order: OrderState): boolean {
  return order.phase === 'confirmed';
}

function getTrackingNumber(order: OrderState): string | null {
  if (order.phase === 'shipped' || order.phase === 'delivered') {
    return order.trackingNumber;
  }
  return null;
}
```

### パターン 3: ユーザー認証

```typescript
type AuthState =
  | { status: 'unauthenticated' }
  | { status: 'loading' }
  | { status: 'authenticated'; user: User; token: string }
  | { status: 'error'; error: string };
```

---

## 型システムの活用

### Type Narrowing（型の絞込み）

```typescript
// if を使った絞込み
if (state.status === 'success') {
  // state: { status: 'success'; data: User }
}

// switch を使った絞込み
switch (state.status) {
  case 'success':
    // state: { status: 'success'; data: User }
    break;
}

// 型ガード関数
function isSuccess(state: RequestState): state is { status: 'success'; data: User } {
  return state.status === 'success';
}

if (isSuccess(state)) {
  // state: { status: 'success'; data: User }
}
```

---

## 他の言語での実装

### TypeScript
```typescript
type Result<T, E> =
  | { kind: 'ok'; value: T }
  | { kind: 'error'; error: E };
```

### Rust
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### Scala
```scala
sealed trait Result[+T]
case class Success[T](value: T) extends Result[T]
case class Failure(error: String) extends Result[Nothing]
```

---

## メリット・デメリット

### メリット

| 項目 | 効果 |
|------|------|
| **型安全性** | 矛盾した状態が作れない |
| **ランタイムエラー削減** | 型チェックで防止 |
| **コード の可読性** | 各状態が明確 |
| **保守性向上** | 新しい状態追加時にエラーで通知 |
| **IDE サポート** | 自動補完が正確 |

### デメリット

| 項目 | 対応 |
|------|------|
| **初期コード量** | Union型を定義する手間 |
| **ネストの増加** | 状態が多いと複雑に |

---

## ベストプラクティス

### 1. Discriminator を統一

```typescript
// ✅ status で統一
type State =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: E };

// ❌ 名前がバラバラ
type State =
  | { kind: 'loading' }
  | { status: 'ready'; data: T }
  | { type: 'error'; error: E };
```

### 2. 必要なフィールドのみを含める

```typescript
// ✅ 必要なデータのみ
type State =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: E };

// ❌ 不要なフィールド
type State =
  | { status: 'loading'; data?: T; error?: E }
  | { status: 'ready'; data: T; error?: E }
  | { status: 'error'; data?: T; error: E };
```

### 3. Exhaustiveness Check を使う

```typescript
function handle(state: State): void {
  switch (state.status) {
    case 'loading':
      // ...
      break;
    case 'ready':
      // ...
      break;
    case 'error':
      // ...
      break;
    default:
      const _exhaustive: never = state;
      throw new Error(`Unhandled state: ${_exhaustive}`);
  }
}
```

---

**次のステップ**: type-safety/03 で、より複雑な型チェックを学びましょう。
