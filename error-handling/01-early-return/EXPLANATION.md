# 詳細な解説

## このリファクタリングの概要

「早期リターン（Early Return）」は、エラーハンドリングのもっとも基本的で重要なパターンです。

**元のコード**の問題点を、**どのように改善した** かを見ていきます。

---

## 問題点の分析

### 1. ネストの深さ（Nesting Depth）

元のコードは **4層のネスト** があります：

```typescript
if (user) {                    // Level 1
  if (user.email) {            // Level 2
    if (user.email.includes('@')) {  // Level 3
      if (user.age > 0) {      // Level 4
        return { isValid: true };
      }
    }
  }
}
```

ネストが深いと：
- 👎 括弧のペアリングが難しい
- 👎 各条件の終わりが見えない
- 👎 スコープが深く、変数の有効範囲の追跡が困難
- 👎 認知負荷が高い

**心理学的事実**
人間が無理なく理解できるネスト深さは **2～3層** が目安です。
4層以上になると、急速に読みにくくなります。

### 2. エラーハンドリングと正常系の混在

```typescript
if (条件A) {
  if (条件B) {
    // ✅ 正常系
    return success;
  } else {
    // ❌ エラー系
  }
} else {
  // ❌ エラー系
}
```

このパターンでは：
- 正常系がネストの深い位置にある
- 異常系と正常系が混在している
- どれがメインの処理かが不明確

### 3. テストの困難さ

ネストが深いと、テストの組み合わせが増えます：

- `user` が `null` の場合
- `user.email` が存在しない場合
- `user.email` に `@` が無い場合
- `user.age` が 0 以下の場合

各組み合わせをテストするのが複雑になります。

---

## 解決策: 早期リターン（Guard Clause）

### 基本的な考え方

```typescript
// ❌ Before: if/else が深くネストされている
if (valid) {
  if (valid2) {
    if (valid3) {
      ✅ do something
    }
  }
}

// ✅ After: エラーを先に処理して返す
if (!valid) return error;
if (!valid2) return error;
if (!valid3) return error;

✅ do something
```

**キーポイント**
1. **異常系を先に処理する**（ガード句）
2. **各チェックで即座に返す**（早期リターン）
3. **最後に正常系を実行**

### 改善されたコード

```typescript
export function validateUserInput(user: any): ValidationResult {
  // ガード句 1: 最初の条件をチェック
  if (!user) {
    return { isValid: false, message: 'User object is required' };
  }

  // ガード句 2: 次の条件をチェック
  if (!user.email) {
    return { isValid: false, message: 'Email is required' };
  }

  // ガード句 3
  if (!user.email.includes('@')) {
    return { isValid: false, message: 'Email must contain @' };
  }

  // ガード句 4
  if (!user.age || user.age <= 0) {
    return { isValid: false, message: 'Age must be greater than 0' };
  }

  // ✅ ここまで到達 = すべての条件をクリア
  return { isValid: true, message: 'User input is valid' };
}
```

### メリット

| 項目 | 改善前 | 改善後 |
|------|--------|--------|
| **ネスト深さ** | 4層 | 1層 |
| **可読性** | 低（括弧の追跡が困難） | 高（直線的） |
| **テストのしやすさ** | 複雑（組み合わせが多い） | シンプル（独立した条件） |
| **保守性** | 低（条件追加時にネストが深くなる） | 高（新しいガード句を追加するだけ） |
| **正常系の明確性** | 不明確（ネストの深い位置） | 明確（最後の処理） |

---

## ガード句のベストプラクティス

### 1. 条件を否定形で書く

```typescript
// ❌ 肯定形（避けるべき）
if (user) {
  // 処理
}

// ✅ 否定形（推奨）
if (!user) {
  return error;
}
// 処理
```

**理由**
- エラーが即座に明確になる
- 正常系のコードが最後になり、フローが分かりやすい

### 2. 各ガード句は独立させる

```typescript
// ❌ 複合条件（避けるべき）
if (!user || !user.email || !user.age) {
  return error; // どれが問題かが不明確
}

// ✅ 分割（推奨）
if (!user) {
  return { isValid: false, message: 'User object is required' };
}
if (!user.email) {
  return { isValid: false, message: 'Email is required' };
}
if (!user.age || user.age <= 0) {
  return { isValid: false, message: 'Age must be greater than 0' };
}
```

**理由**
- エラーメッセージが具体的
- 各条件が独立しているので、テストが簡単
- 条件の追加・削除が容易

### 3. 早期リターンで「すべてOK」を明示

```typescript
// ガード句後は暗黙的に「すべてOK」の状態

// ✅ 正常系のみ
return { isValid: true, message: 'User input is valid' };
```

---

## 実務での応用例

### API のリクエスト検証

```typescript
async function createUser(body: unknown) {
  // ガード句: 入力値の検証
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body' };
  }

  const { email, name } = body as any;

  if (!email || typeof email !== 'string') {
    return { error: 'Email is required and must be a string' };
  }

  if (!name || typeof name !== 'string') {
    return { error: 'Name is required and must be a string' };
  }

  // ✅ すべての検証を通過 → ユーザー作成
  return await db.createUser({ email, name });
}
```

### React コンポーネント内での使用

```typescript
function UserProfile({ userId }: { userId: string | null }) {
  // ガード句: 必要なデータの確認
  if (!userId) {
    return <div>User ID is required</div>;
  }

  const user = useUser(userId);

  if (!user) {
    return <div>Loading...</div>;
  }

  // ✅ ここまで到達 = userId と user がある
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## 関連パターン

このパターンは以下の改善へのステップになります：

### 1. **早期リターン** （このレッスン）
基本：条件をチェックして早期に返す

### 2. **Union型によるエラー表現** （次のレッスン）
より型安全な方法

### 3. **Result型パターン** （その次）
関数型プログラミングのアプローチ

---

## チェックリスト

自分のコードが以下を満たしているか確認してください：

- [ ] ネストの深さが 2 以下になっている
- [ ] エラーケースが最初に処理されている
- [ ] エラーメッセージが具体的である
- [ ] 正常系の処理が明確に見える
- [ ] すべてのテストが通る
- [ ] TypeScript の型チェックに通る

---

## 参考資料

### 書籍
- **Martin Fowler "Refactoring: Improving the Design of Existing Code"**
  - Early Return / Guard Clause パターン

### オンライン
- [Refactoring.Guru: Guard Clauses](https://refactoring.guru/replace-nested-conditionals-with-guard-clauses)
- [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
  - Chapter 3: Functions

### 関連する概念
- **Cyclomatic Complexity（循環複雑度）**
  - コードの複雑さを測る指標。ネストが深いと複雑度が上がる

- **Cognitive Load（認知負荷）**
  - 人が理解するのに必要なメンタルエネルギー

---

**次のステップ**: 02-union-type-errors へ進んで、型を使ったより安全なエラーハンドリングを学びましょう。
