// ❌ リファクタリング前: 深くネストされた実装

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
 * 複数の条件がネストされており、読みにくい状態
 */
export function validateUserInput(user: any): ValidationResult {
  if (user) {
    if (user.email) {
      if (user.email.includes('@')) {
        if (user.age && user.age > 0) {
          // ✅ 本来の処理
          return {
            isValid: true,
            message: 'User input is valid',
          };
        } else {
          return {
            isValid: false,
            message: 'Age must be greater than 0',
          };
        }
      } else {
        return {
          isValid: false,
          message: 'Email must contain @',
        };
      }
    } else {
      return {
        isValid: false,
        message: 'Email is required',
      };
    }
  } else {
    return {
      isValid: false,
      message: 'User object is required',
    };
  }
}
