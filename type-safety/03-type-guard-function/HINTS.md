# ヒント集

## ヒント 1: 型ガード関数の基本

**💡 考え方**

`is` キーワードを使った関数は、TypeScript に「この条件が true なら、値はこの型である」と伝えます。

```typescript
// 型ガード関数の基本形
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

// 使用例
if (isUser(data)) {
  // ここで data は User 型に自動的に絞り込まれる
  console.log(data.name);
}
```

**ポイント**
- `value is User` という戻り値の型が重要
- 関数内で条件をすべてチェック
- TypeScript が自動的に型を絞り込む

---

## ヒント 2: チェック項目

**💡 実装のステップ**

User 型ガード関数を実装する場合：

```typescript
// ステップ 1: オブジェクトかどうか
typeof value === 'object' && value !== null

// ステップ 2: 必要なプロパティが存在するか
'id' in value && 'name' in value && 'email' in value

// ステップ 3: 各プロパティの型が正しいか
typeof (value as any).id === 'string' &&
typeof (value as any).name === 'string' &&
typeof (value as any).email === 'string'
```

---

## ヒント 3: 組み合わせて使う

**💡 複数の型ガード関数**

```typescript
function isUser(value: unknown): value is User { ... }
function isPost(value: unknown): value is Post { ... }

// if-else で使う
if (isUser(data)) {
  // data は User
} else if (isPost(data)) {
  // data は Post
}

// filter で使う
const users = items.filter(isUser);
```

---

**準備ができたら、`good.ts` を開いて比較しましょう。**
