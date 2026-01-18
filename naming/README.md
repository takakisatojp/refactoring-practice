# Naming（命名）

分かりやすく、保守性の高い命名規約とドメイン用語の統一を学びます。

## 📚 このトピックで学べること

- ✅ 変数名の改善
- ✅ 関数名の改善
- ✅ 型名の改善
- ✅ 略語の適切な使用
- ✅ ドメイン用語の統一

## 📂 問題一覧

| # | 問題 | 難易度 | 説明 |
|---|------|--------|------|
| 01 | [Variable Naming](./01-variable-naming/) | ⭐ Easy | 変数名を意味のある名前に改善 |
| 02 | [Function Naming](./02-function-naming/) | ⭐ Easy | 関数名が動作を表すように |
| 03 | [Type Naming](./03-type-naming/) | ⭐ Easy | 型名の統一と改善 |
| 04 | [Abbreviation Usage](./04-abbreviation-usage/) | ⭐ Easy | 略語の適切な使い分け |
| 05 | [Domain Terms](./05-domain-terms/) | ⭐ Easy | ドメイン用語の統一 |

## 🎯 推奨学習順

すべて基礎レベルです。順番に学びましょう：

1. 01: Variable Naming - わかりやすい変数名
2. 02: Function Naming - 動作を表す関数名
3. 03: Type Naming - 型名の統一
4. 04: Abbreviation Usage - 略語のルール
5. 05: Domain Terms - ビジネス用語の統一

## 💡 学習ポイント

### 変数名のルール
- 目的が明確
- スコープに合わせた長さ
- 省略しすぎない

### 関数名のルール
- 動詞で始まる（`getUser`, `validateEmail`）
- 何をするかが明確
- 副作用がある場合は明示

### 型名のルール
- 大文字で始まる（PascalCase）
- 名詞か形容詞
- 一般的な接尾辞（Props, State, Handler）

### 略語ガイドライン
- よく知られている（URL, HTTP）→ OK
- コンテキストで明確（idx → index に変更推奨）
- チーム内で統一

### ドメイン用語
ビジネス側で使っている用語をそのまま使う。
（`user` を `member`, `profile` など混ぜない）

---

**ルートREADME**: [../README.md](../README.md)
