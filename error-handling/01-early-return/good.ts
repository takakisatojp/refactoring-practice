// ✅ リファクタリング後: 早期リターンでネスト削減

interface User {
  email?: string;
  age?: number;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * ユーザー入力を検証する関数
 * 早期リターン（Guard Clause）を使用してネストを削減
 *
 * 改善ポイント：
 * - エラーケースを最初に処理（早期リターン）
 * - ネストを1層に削減
 * - 本来の処理が明確に見える
 */
export function validateUserInput(user: any): ValidationResult {
  // ガード句 1: ユーザーオブジェクトの存在確認
  if (!user) {
    return {
      isValid: false,
      message: 'User object is required',
    };
  }

  // ガード句 2: メールアドレスの存在確認
  if (!user.email) {
    return {
      isValid: false,
      message: 'Email is required',
    };
  }

  // ガード句 3: メールアドレスの形式確認
  if (!user.email.includes('@')) {
    return {
      isValid: false,
      message: 'Email must contain @',
    };
  }

  // ガード句 4: 年齢の妥当性確認
  if (!user.age || user.age <= 0) {
    return {
      isValid: false,
      message: 'Age must be greater than 0',
    };
  }

  // ✅ すべての条件を満たした場合の正常系処理
  return {
    isValid: true,
    message: 'User input is valid',
  };
}
