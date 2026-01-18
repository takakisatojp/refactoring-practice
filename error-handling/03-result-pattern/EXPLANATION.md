# 詳細な解説

## このパターンの背景

複数のステップがある処理では、各ステップでエラーが発生する可能性があります：

```typescript
// ユーザー取得 → 投稿取得 → プロフィール構築

async function getUserProfile(userId) {
  // ステップ 1
  const user = await fetchUser(userId);
  if (error) return error;

  // ステップ 2
  const posts = await fetchPosts(user.id);
  if (error) return error;

  // ステップ 3
  return buildProfile(user, posts);
}
```

各ステップでエラーチェックが必要になり、コードが冗長になります。

---

## Result型パターンとは

### 関数型プログラミングの思想

Result型パターンは関数型プログラミングから来たアイデアです。

```
// 命令型的なアプローチ
if (条件) {
  処理A
} else {
  エラー処理
}

// 関数型的なアプローチ（Result型）
値
  .map(処理A)
  .flatMap(処理B)
  .mapErr(エラー処理)
```

### 実装例

```typescript
class Ok<T> {
  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U, any> {
    return new Ok(fn(this.value));
  }

  flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }
}

class Err<E> {
  constructor(readonly error: E) {}

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this; // エラーをそのまま返す
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this; // エラーをそのまま返す
  }
}

type Result<T, E> = Ok<T> | Err<E>;
```

---

## メソッドの詳細

### map: 値を変換

```typescript
const result = ok(5).map((x) => x * 2);
// Ok(5) → map (x) => x * 2 → Ok(10)

const error = err('error').map((x) => x * 2);
// Err('error') → map → Err('error')（変わらない）
```

**用途**: 成功時の値を変換

### flatMap: Result を返す関数で変換

```typescript
const result = ok(5).flatMap((x) => ok(x * 2));
// Ok(5) → flatMap (x) => ok(x * 2) → Ok(10)

const error = ok(5).flatMap((x) => err('error'));
// Ok(5) → flatMap (x) => err('error') → Err('error')
```

**用途**: 新しい Result を返す非同期処理を組み合わせる

### mapErr: エラーを変換

```typescript
const result = err('error').mapErr((e) => `Error: ${e}`);
// Err('error') → mapErr → Err('Error: error')

const ok_result = ok(5).mapErr((e) => `Error: ${e}`);
// Ok(5) → mapErr → Ok(5)（変わらない）
```

**用途**: エラー型を変換

---

## チェーンメソッドの効果

### 改善前

```typescript
async function getUserProfile(userId: string): Promise<UserProfile | AppError> {
  const userResult = await fetchUser(userId);
  if (isError(userResult)) {
    return userResult;
  }
  const user = userResult;

  const postsResult = await fetchPosts(user.id);
  if (isError(postsResult)) {
    return postsResult;
  }
  const posts = postsResult;

  return {
    user,
    posts,
    postCount: posts.length,
  };
}
```

**問題点**
- エラーチェックが何度も出現
- ネストが増える可能性
- 処理の流れが見にくい

### 改善後

```typescript
export async function getUserProfile(userId: string): Promise<Result<UserProfile, AppError>> {
  return (await fetchUser(userId)).flatMap((user) =>
    fetchPosts(user.id).then((postsResult) =>
      postsResult.map((posts) => ({
        user,
        posts,
        postCount: posts.length,
      }))
    )
  );
}
```

**メリット**
- エラー処理が自動で伝播
- 処理の流れが明確
- 各ステップが独立

---

## 実務でのパターン

### パターン 1: Rust の Result

```rust
pub fn parse_version(header: &[u8]) -> Result<String, ParseError> {
    let version = parse_u16(header)?;
    Ok(version.to_string())
}
```

JavaScriptでは:

```typescript
function parseVersion(header: Uint8Array): Result<string, ParseError> {
  return parseU16(header).flatMap((version) => ok(version.toString()));
}
```

### パターン 2: 複数ステップの連鎖

```typescript
const result = await step1(input)
  .flatMap((v1) => step2(v1))
  .flatMap((v2) => step3(v2))
  .flatMap((v3) => step4(v3));

if (result.isOk()) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

### パターン 3: エラーハンドリング

```typescript
const result = await step1(input)
  .flatMap((v1) => step2(v1))
  .catch((error) => {
    // エラーから復帰
    return ok(defaultValue);
  });
```

---

## 関連する概念

### Monad パターン

Result型は **Monad** という関数型プログラミングの重要な概念です。

```
Monad の3つのメソッド：
1. pure/return: 値を Result でラップ → ok(value)
2. map: 値を変換 → result.map(fn)
3. flatMap/bind: Result を返す関数で変換 → result.flatMap(fn)
```

### Railway Oriented Programming

複数のステップを「線路」として見立てるアプローチ：

```
入力 → [成功路線] → [成功路線] → [成功路線] → 出力
       ↓
      [失敗路線] ───────────────→ エラー
```

---

## メリット・デメリット

### メリット

| 項目 | 効果 |
|------|------|
| **エラー自動伝播** | flatMap で自動的に伝播 |
| **処理の流れが明確** | メソッドチェーンで視覚的 |
| **型安全** | エラーと成功が型レベルで区別 |
| **再利用性** | 関数を組み合わせやすい |
| **テストが簡単** | 各ステップを独立してテスト可能 |

### デメリット

| 項目 | 対応 |
|------|------|
| **学習曲線** | 関数型プログラミングの理解が必要 |
| **ボイラープレート** | Ok/Err クラスの定義が必要 |
| **デバッグの複雑さ** | チェーン内でのデバッグが工夫必要 |

---

## 選択肢の比較

| パターン | 特徴 | 使い場面 |
|---------|------|---------|
| **try/catch** | シンプル | 1-2個のステップ |
| **Union型** | 型安全 | 複数のエラー型 |
| **Result型** | エレガント | 複数ステップ、関数型志向 |
| **Promise.then** | 非同期対応 | 非同期処理の連鎖 |

---

## 参考資料

### 関数型プログラミング
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
- [The Billion Dollar Mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/)

### 言語実装
- [Rust Result](https://doc.rust-lang.org/std/result/)
- [Go error handling](https://golang.org/doc/effective_go#errors)
- [Scala Either](https://www.scala-lang.org/api/current/scala/util/Either.html)

### ライブラリ
- [fp-ts](https://github.com/gcanti/fp-ts)
- [neverthrow](https://github.com/supermacro/neverthrow)

---

**次のステップ**: type-safety トピックで、より型システムを活用したリファクタリングを学びましょう。
