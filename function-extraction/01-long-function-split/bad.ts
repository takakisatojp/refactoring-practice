// ❌ リファクタリング前: 1つの巨大な関数

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

// 実装省略（実際には DB 操作）
const database = {
  users: {} as Record<string, UserData>,
};

/**
 * ユーザー登録を行う関数
 * 複数の責務が混在：入力検証、DB操作、メール送信、ログ記録
 */
export async function registerUser(userData: UserData): Promise<RegistrationResult> {
  // 入力検証（20行）
  if (!userData.email || !userData.email.includes('@')) {
    return { success: false, error: 'Invalid email' };
  }

  if (!userData.password || userData.password.length < 8) {
    return { success: false, error: 'Password too short' };
  }

  if (!userData.name || userData.name.trim().length === 0) {
    return { success: false, error: 'Name is required' };
  }

  if (userData.age < 18 || userData.age > 120) {
    return { success: false, error: 'Invalid age' };
  }

  // メールアドレスの一意性チェック
  const existingUser = Object.values(database.users).find(
    (user) => user.email === userData.email,
  );
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // ユーザー作成（10行）
  const userId = `user_${Date.now()}`;
  const user = {
    email: userData.email,
    password: userData.password, // 本来はハッシュ化
    name: userData.name,
    age: userData.age,
  };
  database.users[userId] = user;

  // メール送信（10行）
  const emailBody = `Welcome ${userData.name}!\nYour account has been created.\nEmail: ${userData.email}`;
  const emailSent = await sendEmail(userData.email, 'Welcome!', emailBody);

  if (!emailSent) {
    // メール送信失敗時のハンドリング
    delete database.users[userId];
    return { success: false, error: 'Failed to send welcome email' };
  }

  // ログ記録（5行）
  console.log(`User registered: ${userId}`);
  console.log(`Email: ${userData.email}`);
  console.log(`Name: ${userData.name}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  return {
    success: true,
    userId,
  };
}

// ヘルパー関数（実装省略）
async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  // 実装省略
  return true;
}
