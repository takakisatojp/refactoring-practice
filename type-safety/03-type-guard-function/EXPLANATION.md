# 詳細な解説

## 型ガード関数の重要性

TypeScript で `unknown` 型のデータを受け取る場合、型チェックを繰り返すのは冗長になります。

```typescript
// 改善前：毎回手動でチェック
if (
  data &&
  typeof data === 'object' &&
  'id' in data &&
  // ... さらに複数のチェック
) {
  const user = data as User;
  console.log(user.name);
}

// 別の場所でも同じチェックが必要...
```

---

## 型ガード関数（Type Guard Function）

### 定義

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value &&
    typeof (value as Record<string, unknown>).id === 'string' &&
    typeof (value as Record<string, unknown>).name === 'string' &&
    typeof (value as Record<string, unknown>).email === 'string'
  );
}
```

### 重要な要素

1. **戻り値の型**: `value is User`
   - TypeScript に「この関数が true を返したら、value は User 型である」と伝える
   - これにより **型ガード** が機能

2. **関数内の条件**
   - すべてのプロパティが存在するかチェック
   - 各プロパティの型が正しいかチェック

---

## 型 Narrowing

### 型ガード関数がない場合

```typescript
if (data && typeof data === 'object' && 'email' in data) {
  // data は依然として object 型
  console.log(data.email); // ❌ エラー（object には email プロパティ保証がない）
}
```

### 型ガード関数がある場合

```typescript
if (isUser(data)) {
  // data は自動的に User 型に絞り込まれる
  console.log(data.email); // ✅ OK
  console.log(data.name); // ✅ OK
}
```

---

## 実務での活用

### 1. API レスポンスの検証

```typescript
interface ApiUser {
  id: string;
  name: string;
}

function isApiUser(value: unknown): value is ApiUser {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).id === 'string' &&
    typeof (value as any).name === 'string'
  );
}

async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  if (isApiUser(data)) {
    return data; // User 型として安全に返す
  } else {
    throw new Error('Invalid user data');
  }
}
```

### 2. 配列のフィルタリング

```typescript
const mixed: unknown[] = [user1, 'string', post1, 123];

const users = mixed.filter(isUser);
// users は User[] 型に自動的に絞り込まれる
```

### 3. Union 型の判定

```typescript
type Data = User | Post | string;

function process(data: Data) {
  if (isUser(data)) {
    console.log(data.name);
  } else if (isPost(data)) {
    console.log(data.title);
  } else {
    console.log(data.toUpperCase());
  }
}
```

---

## ベストプラクティス

### 1. チェックロジックを関数化

```typescript
// ❌ 悪い例（毎回チェック）
if (data && typeof data === 'object' && 'id' in data && ...) {
  // ...
}

// ... 別の場所でも同じチェック ...

// ✅ 良い例（関数化）
function isUser(value: unknown): value is User { ... }

if (isUser(data)) {
  // ...
}
```

### 2. 複雑なチェックはヘルパー関数に

```typescript
function isValidEmail(email: string): boolean {
  return email.includes('@') && email.includes('.');
}

function isValidUser(value: unknown): value is User {
  return (
    isUser(value) &&
    isValidEmail(value.email) &&
    value.id.length > 0
  );
}
```

### 3. Union 型の型ガード

```typescript
type Content = User | Post | string;

// 正確な型ガード
function isUserContent(content: Content): content is User {
  return isUser(content);
}

function isPostContent(content: Content): content is Post {
  return isPost(content);
}
```

---

## 関連する概念

### User-Defined Type Guard vs typeof

```typescript
// typeof では Union 型は絞り込めない
if (typeof data === 'object') {
  // data は object | null（複数の型の可能性）
}

// User-Defined Type Guard なら具体的な型に絞り込める
if (isUser(data)) {
  // data は User 型（1つの型に確定）
}
```

### Assertion Functions

TypeScript 4.0+ では、別の書き方も可能：

```typescript
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Value is not a User');
  }
}

// 使用例
assertUser(data); // この後、data は User 型
```

---

## メリット・デメリット

### メリット

| 項目 | 効果 |
|------|------|
| **コード重複削減** | チェック ロジックを1か所で管理 |
| **型安全性向上** | 誤った型アサーション を防止 |
| **保守性向上** | チェック ロジック変更時に1か所だけ修正 |
| **テスト容易** | 型ガード関数のみ テスト可能 |

### デメリット

| 項目 | 対応 |
|------|------|
| **コード量増加** | 型ガード関数の定義が必要 |
| **パフォーマンス** | ラップチェックのため若干遅い |

---

## 参考資料

### TypeScript 公式
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

### 実装パターン
- [io-ts](https://github.com/gcanti/io-ts) - ランタイム型チェック
- [Zod](https://github.com/colinhacks/zod) - スキーマバリデーション

---

**次のステップ**: function-extraction へ進んで、関数の分割と抽象化を学びましょう。
