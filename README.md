# TypeScript/React リファクタリング練習問題集

実務で行われたリファクタリングから厳選された **50個の練習問題** で、TypeScript/React/Next.js のスキルを段階的に向上させるための教材です。

## 📚 概要

- **問題数**: 50問
- **難易度**: Easy (18問) → Medium (22問) → Hard (10問)
- **形式**: 4点セット（問題文・初期コード・解答例・テストコード）
- **対象**: TypeScript/React 初級～上級者

## 🎯 学習目標

このコースを完了すると、以下のスキルが身につきます：

- ✅ エラーハンドリングのベストプラクティス
- ✅ 型安全な TypeScript コードの書き方
- ✅ 関数抽出と責務分離
- ✅ React パターンの実装
- ✅ 非同期処理の最適化
- ✅ コード品質の向上

## 📂 トピック一覧

| # | トピック | 問題数 | 難易度 |
|---|---------|--------|--------|
| 1 | [Error Handling](#1-error-handling) | 8 | ⭐～⭐⭐⭐ |
| 2 | [Type Safety](#2-type-safety) | 7 | ⭐～⭐⭐⭐ |
| 3 | [Function Extraction](#3-function-extraction) | 7 | ⭐～⭐⭐ |
| 4 | [Data Processing](#4-data-processing) | 6 | ⭐～⭐⭐⭐ |
| 5 | [Naming](#5-naming) | 5 | ⭐ |
| 6 | [React Patterns](#6-react-patterns) | 8 | ⭐～⭐⭐⭐ |
| 7 | [Async Patterns](#7-async-patterns) | 6 | ⭐⭐～⭐⭐⭐ |
| 8 | [Code Cleanup](#8-code-cleanup) | 3 | ⭐ |
| | **合計** | **50** | |

### 1. Error Handling
エラーハンドリングの適切な設計と実装パターンを学びます。

- 早期リターンによるネスト削減
- Union型によるエラー表現
- Result型パターン
- エラーバウンダリの設計

📁 [error-handling/](./error-handling)

### 2. Type Safety
TypeScript の型システムを活用した安全なコード設計です。

- Discriminated Union 型
- 型ガード関数
- Generic 型の活用
- Conditional 型

📁 [type-safety/](./type-safety)

### 3. Function Extraction
関数の適切な分割と抽象化を学びます。

- 長関数の分割
- 単一責任の原則
- 高階関数
- 関数合成

📁 [function-extraction/](./function-extraction)

### 4. Data Processing
データ処理の最適化と効率化です。

- 配列操作の最適化
- 不変性の維持
- データパイプライン
- パフォーマンス改善

📁 [data-processing/](./data-processing)

### 5. Naming
分かりやすい命名規約とドメイン用語の統一です。

- 変数名の改善
- 関数名の改善
- 型名の改善

📁 [naming/](./naming)

### 6. React Patterns
React の効果的なパターンと最適化を学びます。

- カスタムフック
- コンポーネント設計
- 状態管理
- パフォーマンス最適化

📁 [react-patterns/](./react-patterns)

### 7. Async Patterns
非同期処理の適切な実装です。

- Promise チェーンの改善
- async/await の活用
- エラーハンドリング
- 並行処理

📁 [async-patterns/](./async-patterns)

### 8. Code Cleanup
コードの整理と最適化です。

- デッドコード除去
- インポート整理
- 定数化

📁 [code-cleanup/](./code-cleanup)

---

## 🚀 環境構築

### 必須環境
- Node.js 18.0 以上
- npm または yarn

### セットアップ手順

#### 1. リポジトリをクローン
```bash
git clone <repository-url>
cd refactoring-practice
```

#### 2. 依存パッケージをインストール
```bash
npm install
# または
yarn install
```

#### 3. TypeScript コンパイラのセットアップを確認
```bash
npx tsc --version
```

### テスト実行

すべてのテストを実行：
```bash
npm test
```

特定のトピックのみ実行：
```bash
npm test error-handling/01-early-return/
```

UI付きでテストを実行：
```bash
npm run test:ui
```

カバレッジレポートを生成：
```bash
npm run test:coverage
```

---

## 📖 各問題の構成

各問題フォルダには以下のファイルが含まれています：

| ファイル | 説明 |
|---------|------|
| `README.md` | 問題文・学習目標・達成ゴール |
| `bad.ts` / `bad.tsx` | リファクタリング前の初期コード |
| `good.ts` / `good.tsx` | リファクタリング後の解答例 |
| `test.test.ts` / `test.test.tsx` | テストコード（両方で成功） |
| `HINTS.md` | 段階的なヒント（3段階） |
| `EXPLANATION.md` | 詳細な解説と参考資料 |

### 学習フロー

1. **問題文を読む** (`README.md`)
   - 学習目標を確認
   - 現在のコードの問題点を理解
   - ゴールを把握

2. **初期コードを確認** (`bad.ts`)
   - 実装を読む
   - 何が問題なのか考える

3. **テストを実行** (`npm test`)
   - 初期コードで動作することを確認

4. **リファクタリングに取り組む**
   - ヒント 1 を読む → 自分で実装
   - 詰まったらヒント 2, 3 を参照
   - テストで動作確認

5. **解答例を確認** (`good.ts`)
   - 自分のコードと比較
   - 改善ポイントを確認

6. **解説を読む** (`EXPLANATION.md`)
   - なぜそのリファクタリングが必要なのか
   - より深い学習

---

## 💡 活用方法

### 初心者向け
1. Easy 問題から順番に解く
2. ヒントを積極的に活用
3. 解説を詳しく読む

### 中級者向け
1. Medium 問題から始める
2. ヒントなしで挑戦
3. 解答例との差分を確認

### 上級者向け
1. Hard 問題に挑戦
2. 複数の解法を考える
3. パフォーマンス最適化を検討

---

## 🎓 推奨学習順

### Week 1-2: 基礎
- Naming（命名の基本）
- Code Cleanup（コード整理）
- Easy レベルの他の問題

### Week 3-4: コアスキル
- Error Handling（エラーハンドリング）
- Type Safety（型安全性）
- Function Extraction（関数抽出）

### Week 5-6: 応用
- Data Processing（データ処理）
- React Patterns（React パターン）
- Async Patterns（非同期処理）

### Week 7+: 総合演習
- Hard 問題に挑戦
- 複合的なリファクタリング
- 実際のプロジェクトへの応用

---

## 📝 問題作成ガイド

このプロジェクトに新しい問題を追加したい場合は、[PROBLEM_CREATION_GUIDE.md](./PROBLEM_CREATION_GUIDE.md) を参照してください。

---

## ✅ 品質保証

すべての問題は以下の基準を満たしています：

- ✅ 初期コード・解答例が実際に動作
- ✅ テストコードが 100% 通過
- ✅ 型チェックエラーがない
- ✅ 実務に役立つ内容
- ✅ 初学者にも理解できる説明

---

## 🔗 参考資料

### リファクタリング
- [Refactoring.Guru](https://refactoring.guru/)
- Martin Fowler "Refactoring: Improving the Design of Existing Code"
- [Code Smells](https://refactoring.guru/refactoring/smells)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Effective TypeScript](https://effectivetypescript.com/)

### React
- [React Documentation](https://react.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Patterns](https://reactpatterns.com/)

### テスト
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

---

## 📄 ライセンス

MIT

---

## 🤝 貢献

問題の改善提案やバグ報告は、Issue や Pull Request で受け付けています。

---

**Happy Refactoring! 🎉**
