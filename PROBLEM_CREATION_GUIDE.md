# リファクタリング練習問題 作成ガイド
## 概要
このドキュメントは、実務で行われたリファクタリングから学習用の練習問題を作成するためのガイドラインです。
### 目的
- 実際のリファクタリング事例から、TypeScript/React/Next.jsの技術力向上のための練習問題を作成する
- 50問程度の問題セットを作成し、段階的にスキルアップできる教材とする
- **問題・初期コード・解答例・テストコード**の4点セットで学習効果を最大化する
---
## 問題の構成要素
各問題には以下の要素を含める：
### 1. 問題文 (`README.md`)
- 学習目標
- 現在のコードの問題点
- 達成すべきゴール
- 制約条件
### 2. 初期コード (`bad.ts` / `bad.tsx`)
- リファクタリング前のコード
- 実務に近い実装
- 意図的な問題点を含む
### 3. 解答例 (`good.ts` / `good.tsx`)
- リファクタリング後のコード
- ベストプラクティスに従った実装
- コメントで改善ポイントを説明
### 4. テストコード (`test.test.ts` / `test.test.tsx`)
- 動作の正確性を検証
- リファクタリング前後で挙動が変わらないことを保証
### 5. 解説 (`EXPLANATION.md`)
- なぜそのリファクタリングが必要だったか
- どのように改善したか
- 参考資料へのリンク
### 6. ヒント (`HINTS.md`)
- 段階的なヒント（3段階程度）
- 完全な答えは書かず、考え方を誘導
---
## ディレクトリ構造
```
refactoring-practice/
├── README.md                          # 全体の説明
├── PROBLEM_CREATION_GUIDE.md          # このファイル
│
├── error-handling/                    # トピック別ディレクトリ
│   ├── README.md                      # トピックの説明
│   │
│   ├── 01-early-return/               # 個別の問題
│   │   ├── README.md                  # 問題文
│   │   ├── bad.ts                     # 初期コード
│   │   ├── good.ts                    # 解答例
│   │   ├── test.test.ts               # テストコード
│   │   ├── EXPLANATION.md             # 解説
│   │   └── HINTS.md                   # ヒント
│   │
│   ├── 02-union-type-errors/
│   └── ...
│
├── type-safety/
├── function-extraction/
├── data-processing/
├── naming/
├── react-patterns/
├── async-patterns/
└── code-cleanup/
```
---
## 抽出されたトピック
実際のリファクタリングから以下のトピックを抽出しました：
### 1. error-handling（エラーハンドリング）
- 早期リターンによるネストの削減
- Union型によるエラー表現
- Result型パターンの実装
- エラーバウンダリの設計
- エラーの責務分離
### 2. type-safety（型安全性）
- Discriminated Union型の活用
- 戻り値の型を明示化
- 型ガード関数の実装
- 型アサーションの削減
- Generic型の活用
### 3. function-extraction（関数抽出）
- 長い関数の分割
- 単一責任の原則の適用
- 適切な抽象度の関数設計
- コールバック地獄の解消
- 高階関数の活用
### 4. data-processing（データ処理）
- 配列操作の最適化
- 不変性の維持
- データ変換のパイプライン化
- 条件分岐の簡素化
- パフォーマンスの改善
### 5. naming（命名）
- 変数名の改善
- 関数名の改善
- 型名の改善
- 略語の適切な使用
- ドメイン用語の統一
### 6. react-patterns（Reactパターン）
- カスタムフックの抽出
- コンポーネントの責務分離
- Propsの設計
- 状態管理の改善
- パフォーマンス最適化（memo, useMemo）
### 7. async-patterns（非同期処理パターン）
- Promise chainの改善
- async/awaitの活用
- エラーハンドリングの統一
- 並行処理の実装
- リトライ・キャンセル処理
### 8. code-cleanup（コードクリーンアップ）
- 不要なコードの削除
- デッドコードの除去
- インポートの整理
- マジックナンバーの定数化
---
## トピック別の目標問題数
合計50問を以下のように配分：
| トピック | 問題数 | 難易度配分 (Easy:Medium:Hard) |
|---------|--------|------------------------------|
| error-handling | 8問 | 3:3:2 |
| type-safety | 7問 | 2:3:2 |
| function-extraction | 7問 | 3:3:1 |
| data-processing | 6問 | 2:3:1 |
| naming | 5問 | 3:2:0 |
| react-patterns | 8問 | 2:4:2 |
| async-patterns | 6問 | 1:3:2 |
| code-cleanup | 3問 | 2:1:0 |
| **合計** | **50問** | **18:22:10** |
---
## 難易度の定義
### ⭐ Easy
- 基本的なリファクタリングパターン
- 1つの明確な改善ポイント
- 10-30行程度のコード
### ⭐⭐ Medium
- 複数の改善ポイント
- TypeScript/Reactの中級知識が必要
- 30-100行程度のコード
### ⭐⭐⭐ Hard
- 複雑なリファクタリング
- アーキテクチャレベルの改善
- 100行以上のコード
- 複数ファイルにまたがる場合も
---
## 品質チェックリスト
問題を作成したら、以下をチェックしてください：
### コード品質
- [ ] 初期コードは実際に動作するか
- [ ] 解答例は実際に動作するか
- [ ] テストコードはすべて通るか
- [ ] 型エラーは発生しないか
### 問題の質
- [ ] 学習目標は明確か
- [ ] 問題点は具体的か
- [ ] 難易度は適切か
- [ ] 実務に役立つ内容か
### ドキュメント
- [ ] 問題文は分かりやすいか
- [ ] ヒントは段階的か（3段階）
- [ ] 解説は詳細か
- [ ] 参考資料は適切か
### 構成
- [ ] ファイル名は統一されているか
- [ ] ディレクトリ構造は適切か
- [ ] READMEは整備されているか
---
## AIへの指示テンプレート
AIに問題作成を依頼する場合、以下のテンプレートを使用してください：
```markdown
以下のリファクタリングコミットの差分に基づいて、
学習用の練習問題を作成してください。
【コミット情報】
- Hash: [コミットハッシュ]
- メッセージ: [コミットメッセージ]
- 差分:
[git diff の出力を貼り付け]
【作成する問題】
- トピック: [トピック名]
- 難易度: [Easy/Medium/Hard]
- 学習目標: [箇条書きで3つ程度]
【必要なファイル】
1. README.md（問題文）
2. bad.ts または bad.tsx（初期コード）
3. good.ts または good.tsx（解答例）
4. test.test.ts または test.test.tsx（テストコード）
5. HINTS.md（3段階のヒント）
6. EXPLANATION.md（詳細な解説）
【要件】
- TypeScript で記述
- 実際に動作するコード
- テストはVitest を使用
- 実務に役立つ内容
- 初学者にも分かりやすい説明
- bad.ts と good.ts は同じ動作をすること
- テストは bad.ts でも good.ts でも通ること
```
---
## 参考資料
### リファクタリング
- [Refactoring.Guru](https://refactoring.guru/)
- Martin Fowler "Refactoring"
- [Code Smells](https://refactoring.guru/refactoring/smells)
### TypeScript
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Effective TypeScript](https://effectivetypescript.com/)
### React
- [React Patterns](https://reactpatterns.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
---
## 更新履歴
- 2026-01-18: 初版作成
---
この内容に従って問題を作成してもいいです。認識をあわせる必要がある箇所については対話しながら理解を深めていきましょう。
