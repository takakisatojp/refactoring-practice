# 詳細な解説

## 長い関数の問題点

100行以上の巨大な関数には、多くの問題があります：

1. **理解困難**: 複数の処理が混在して、全体像が掴みにくい
2. **テスト困難**: 1つの側面だけをテストできない
3. **再利用困難**: 一部の処理だけを他の場所で使えない
4. **保守困難**: 1つの処理を変更する際に、他の部分に影響を与えるリスク

---

## 関数分割の原則

### 単一責任の原則（Single Responsibility Principle）

1つの関数は **1つのことだけ** をすべきです。

```typescript
// ❌ 複数の責務
async function registerUser(userData) {
  // 検証
  // DB保存
  // メール送信
  // ログ
}

// ✅ 1つの責務
function validateUserInput(userData) { ... }
function saveUserToDatabase(userData) { ... }
async function sendWelcomeEmail(email, name) { ... }
function logUserRegistration(userId, email, name) { ... }
```

### 関数の粒度

理想的な関数のサイズ：
- **行数**: 10～50行
- **複雑度**: 単純な処理
- **テスト**: 単独でテスト可能

---

## 改善のプロセス

### Before: 1つの巨大な関数

```typescript
async function registerUser(userData) {
  // 約 60 行
  // 複数の責務が混在
}
```

### After: 5つの小さな関数

```typescript
function validateUserInput(userData) { ... }           // 10 行
function isEmailAlreadyRegistered(email) { ... }      // 5 行
function saveUserToDatabase(userData) { ... }         // 5 行
async function sendWelcomeEmail(email, name) { ... }  // 5 行
function logUserRegistration(userId, email, name) { ... } // 5 行

async function registerUser(userData) {               // 20 行
  // オーケストレーション
}
```

---

## メリット

### 1. 理解しやすい

```typescript
// オーケストレーション関数から全体像が明確
async function registerUser(userData) {
  const validation = validateUserInput(userData);
  if (!validation.isValid) return error;

  if (isEmailAlreadyRegistered(userData.email)) {
    return error;
  }

  const userId = saveUserToDatabase(userData);
  const sent = await sendWelcomeEmail(userData.email, userData.name);
  if (!sent) {
    delete database.users[userId];
    return error;
  }

  logUserRegistration(userId, userData.email, userData.name);
  return { success: true, userId };
}
```

### 2. テストしやすい

```typescript
// 各関数を独立してテスト
describe('validateUserInput', () => {
  it('should reject invalid email', () => {
    expect(validateUserInput({ email: 'invalid' })).toEqual({
      isValid: false,
      error: 'Invalid email',
    });
  });
});

describe('sendWelcomeEmail', () => {
  it('should send email', async () => {
    const result = await sendWelcomeEmail('test@example.com', 'John');
    expect(result).toBe(true);
  });
});
```

### 3. 再利用しやすい

```typescript
// 他の場所で個別の関数を使える
if (isEmailAlreadyRegistered(email)) {
  // メール重複チェック
}

const isValid = validateUserInput(userData);
// バリデーションのみ実行
```

### 4. 保守しやすい

```typescript
// バリデーションロジックの変更は validateUserInput だけを修正
function validateUserInput(userData) {
  // 変更はここだけ
}
```

---

## 実務パターン

### パターン 1: 検証 → 処理 → 通知

```typescript
async function createOrder(orderData) {
  // 検証
  if (!validateOrder(orderData)) return error;

  // 処理
  const order = createOrderInDB(orderData);

  // 通知
  await sendOrderConfirmation(order.id, order.email);

  return { success: true, orderId: order.id };
}
```

### パターン 2: 前処理 → メイン処理 → 後処理

```typescript
async function processPayment(paymentData) {
  // 前処理
  const validated = validatePaymentData(paymentData);
  if (!validated) return error;

  // メイン処理
  const result = processWithPaymentGateway(paymentData);
  if (!result.success) return error;

  // 後処理
  await updatePaymentStatus(result.transactionId);
  await sendReceipt(result.email);

  return { success: true, transactionId: result.transactionId };
}
```

---

## 関連概念

### Extract Method（抽出メソッド）

最も一般的なリファクタリング手法：
1. 長い関数から一部の処理を選ぶ
2. その部分を独立した関数にする
3. 元の関数から呼び出す

### Chain of Responsibility

関数チェーンで処理を委譲する：

```typescript
async function process(data) {
  const step1 = validate(data);
  if (!step1) return error;

  const step2 = transform(step1);
  if (!step2) return error;

  const step3 = save(step2);
  if (!step3) return error;

  return step3;
}
```

---

## ベストプラクティス

### 1. 関数名は動詞で始まる

```typescript
// ✅ 動詞で始まる
function validateUserInput() { ... }
function saveUserToDatabase() { ... }
function sendWelcomeEmail() { ... }

// ❌ 動詞なし
function userValidation() { ... }
function databaseSave() { ... }
function emailSending() { ... }
```

### 2. 関数シグネチャを明確に

```typescript
// ✅ 入出力が明確
function validateUserInput(userData: UserData): { isValid: boolean; error?: string }

// ❌ 曖昧
function validate(data: any): any
```

### 3. エラーハンドリングを明確に

```typescript
// ✅ エラーが明確
if (isEmailAlreadyRegistered(userData.email)) {
  return { success: false, error: 'Email already registered' };
}

// ❌ ロールバックが曖昧
const result = registerUser(userData);
if (!result) {
  // 何をロールバックすればいい？
}
```

---

**次のステップ**: より複雑な関数分割パターンを学びましょう。
