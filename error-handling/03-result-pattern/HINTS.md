# ヒント集

## ヒント 1: Result型の基本

**💡 考え方**

Result型は、成功と失敗を型レベルで表現します。

```typescript
// 成功時: Ok<T>
// 失敗時: Err<E>

type Result<T, E> = Ok<T> | Err<E>;

// 使用例
const success: Result<number, string> = new Ok(42);
const failure: Result<number, string> = new Err('error');
```

**ポイント**
- `T`: 成功時の値の型
- `E`: 失敗時のエラーの型
- 両者は Union型で統一

---

## ヒント 2: メソッドの実装

**💡 各メソッドの役割**

```typescript
class Ok<T> {
  // 値を変換（エラー時は何もしない）
  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }

  // Result を返す関数で変換（flatMap/bind）
  flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  // エラーを変換（成功時は何もしない）
  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return this as any;
  }
}

class Err<E> {
  // Okの場合と逆の動作
  map<U>(fn: (value: T) => U): Result<U, E> {
    return this; // エラーをそのまま返す
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this; // エラーをそのまま返す
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return new Err(fn(this.error)); // エラーを変換
  }
}
```

---

## ヒント 3: チェーンメソッドの活用

**💡 従来の方法（悪い）**

```typescript
// 毎回エラーチェック
const result1 = await step1();
if (isError(result1)) return result1;

const result2 = await step2(result1);
if (isError(result2)) return result2;

const result3 = await step3(result2);
if (isError(result3)) return result3;
```

**改善方法**

```typescript
// Result型でチェーン
const result = await step1()
  .flatMap((v1) => step2(v1))
  .flatMap((v2) => step3(v2));

// または async/await 的に
const result = await step1()
  .then((v1) => step2(v1).then((v2) => step3(v2)));
```

---

## 実装のコツ

### 1. Ok と Err クラスの対称性

```typescript
// Ok と Err は対称的に実装
// Ok の map → Err は同じ値を返す
// Err の mapErr → Ok は同じ値を返す

class Ok<T> {
  map(fn) { return new Ok(fn(this.value)); }
  mapErr(fn) { return this; } // 変換しない
}

class Err<E> {
  map(fn) { return this; } // 変換しない
  mapErr(fn) { return new Err(fn(this.error)); }
}
```

### 2. flatMap の使い方

```typescript
// map: T → U
const r1 = ok(5).map((x) => x * 2); // Ok(10)

// flatMap: T → Result<U, E>
const r2 = ok(5).flatMap((x) => ok(x * 2)); // Ok(10)
const r3 = ok(5).flatMap((x) => err('error')); // Err('error')
```

### 3. 型ガード関数

```typescript
function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result instanceof Ok;
}

function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result instanceof Err;
}

// 使用例
if (isOk(result)) {
  // result は Ok<T> 型
  console.log(result.value);
} else {
  // result は Err<E> 型
  console.log(result.error);
}
```

### 4. 複数のステップを組み合わせる

```typescript
// ステップ 1: ユーザー取得
// ステップ 2: 投稿取得
// ステップ 3: プロフィール構築

const profile = await fetchUser(id)
  .flatMap((user) =>
    fetchPosts(user.id).flatMap((posts) =>
      ok({
        user,
        posts,
        postCount: posts.length,
      })
    )
  );
```

---

## テストで動作確認

実装後、テストで動作確認しましょう：

```bash
npm test error-handling/03-result-pattern/test.test.ts
```

特に以下をテストしてください：
- map / flatMap / mapErr の動作
- エラーの伝播
- チェーンメソッドの組み合わせ

---

**準備ができたら、`good.ts` を開いて比較しましょう。**
