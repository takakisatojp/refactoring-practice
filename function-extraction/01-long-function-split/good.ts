// ✅ リファクタリング後: 関数を分割して責務を明確に

interface UserData {
  email: string;
  password: string;
  name: string;
  age: number;
}

interface RegistrationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

const database = {
  users: {} as Record<string, UserData>,
};

/**
 * 入力データを検証する関数
 * 責務: バリデーションのみ
 */
function validateUserInput(userData: UserData): { isValid: boolean; error?: string } {
  if (!userData.email || !userData.email.includes('@')) {
    return { isValid: false, error: 'Invalid email' };
  }

  if (!userData.password || userData.password.length < 8) {
    return { isValid: false, error: 'Password too short' };
  }

  if (!userData.name || userData.name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (userData.age < 18 || userData.age > 120) {
    return { isValid: false, error: 'Invalid age' };
  }

  return { isValid: true };
}

/**
 * メールアドレスが既に登録されているかチェック
 */
function isEmailAlreadyRegistered(email: string): boolean {
  return Object.values(database.users).some((user) => user.email === email);
}

/**
 * ユーザーをデータベースに保存する関数
 * 責務: DB操作のみ
 */
function saveUserToDatabase(userData: UserData): string {
  const userId = `user_${Date.now()}`;
  database.users[userId] = userData;
  return userId;
}

/**
 * メールを送信する関数
 * 責務: メール送信のみ
 */
async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const subject = 'Welcome!';
  const body = `Welcome ${name}!\nYour account has been created.\nEmail: ${email}`;
  return await sendEmail(email, subject, body);
}

/**
 * ユーザー登録をログに記録する関数
 * 責務: ログ記録のみ
 */
function logUserRegistration(userId: string, email: string, name: string): void {
  console.log(`User registered: ${userId}`);
  console.log(`Email: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
}

/**
 * メイン処理: ユーザー登録
 * 責務: 各ステップの調整
 * 改善ポイント：
 * - 各処理が関数に分割された
 * - 各関数は1つの責務を持つ
 * - テストしやすくなった
 * - エラーハンドリングが明確
 */
export async function registerUser(userData: UserData): Promise<RegistrationResult> {
  // ステップ 1: 入力検証
  const validation = validateUserInput(userData);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  // ステップ 2: メールアドレスの一意性確認
  if (isEmailAlreadyRegistered(userData.email)) {
    return { success: false, error: 'Email already registered' };
  }

  // ステップ 3: ユーザーをDB保存
  const userId = saveUserToDatabase(userData);

  // ステップ 4: ウェルカムメール送信
  const emailSent = await sendWelcomeEmail(userData.email, userData.name);

  if (!emailSent) {
    // ロールバック
    delete database.users[userId];
    return { success: false, error: 'Failed to send welcome email' };
  }

  // ステップ 5: ログ記録
  logUserRegistration(userId, userData.email, userData.name);

  return {
    success: true,
    userId,
  };
}

// ヘルパー関数
async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  return true;
}

export type { UserData, RegistrationResult };
