# ヒント集

## ヒント 1: 関数分割の基準

**💡 考え方**

1つの関数内に複数の処理がある場合、以下のように分割します。

```
元の関数
├── 入力検証
├── データベース操作
├── メール送信
└── ログ記録

分割後
├── validateUserInput()
├── saveUserToDatabase()
├── sendWelcomeEmail()
└── logUserRegistration()
```

---

## ヒント 2: 各関数の責務

**💡 単一責任の原則（SRP）**

```typescript
// ❌ 悪い例（複数の責務）
function registerUser(userData) {
  // 検証 + DB + メール + ログ
  if (!userData.email.includes('@')) { ... }
  database.save(...);
  sendEmail(...);
  console.log(...);
}

// ✅ 良い例（1つの責務）
function validateUserInput(userData) { ... }
function saveUserToDatabase(userData) { ... }
function sendWelcomeEmail(email, name) { ... }
function logUserRegistration(userId, email) { ... }
```

---

## ヒント 3: メイン関数から呼び出す

**💡 オーケストレーション**

```typescript
export async function registerUser(userData: UserData) {
  // ステップ 1
  const validation = validateUserInput(userData);
  if (!validation.isValid) return { success: false, error: validation.error };

  // ステップ 2
  if (isEmailAlreadyRegistered(userData.email)) {
    return { success: false, error: 'Already registered' };
  }

  // ステップ 3
  const userId = saveUserToDatabase(userData);

  // ステップ 4
  const sent = await sendWelcomeEmail(userData.email, userData.name);
  if (!sent) {
    // Rollback
    delete database.users[userId];
    return { success: false, error: 'Email failed' };
  }

  // ステップ 5
  logUserRegistration(userId, userData.email, userData.name);

  return { success: true, userId };
}
```

---

**準備ができたら、`good.ts` を開いて比較しましょう。**
