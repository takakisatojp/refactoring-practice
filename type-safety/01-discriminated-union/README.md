# 01: Discriminated Union（判別可能な Union 型）

## 学習目標

このリファクタリング問題では以下を学びます：

- ✅ Discriminated Union 型（判別可能な Union）の活用
- ✅ 型安全な状態管理
- ✅ switch 文による type narrowing

## 問題点

複数の状態を管理する場合、Union型だけでは各状態の情報が曖昧になります：

```typescript
// 曖昧な状態管理
type RequestState = {
  status: 'loading' | 'success' | 'error';
  data?: User;
  error?: string;
};

// data と error が両方あることもあり得る（矛盾）
const state: RequestState = {
  status: 'success',
  data: user,
  error: 'Something went wrong', // 矛盾
};
```

### 問題点
- 📌 各状態ごとの必要な情報が不明確
- 📌 矛盾した状態になり得る
- 📌 型チェックが不完全

## ゴール

Discriminated Union を使用して、以下を達成してください：

1. ✅ 各状態を個別の型で定義
2. ✅ 状態ごとに必要な情報のみ含める
3. ✅ 矛盾した状態が作れないようにする

---

**難易度**: ⭐ Easy | **所要時間**: 15-20分
