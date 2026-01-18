# React Patterns（React パターン）

React の効果的な設計パターンとパフォーマンス最適化を学びます。

## 📚 このトピックで学べること

- ✅ カスタムフックの抽出
- ✅ コンポーネントの責務分離
- ✅ Props の効果的な設計
- ✅ 状態管理の改善
- ✅ パフォーマンス最適化（memo, useMemo）
- ✅ useCallback による最適化
- ✅ Context API と Reducer パターン

## 📂 問題一覧

| # | 問題 | 難易度 | 説明 |
|---|------|--------|------|
| 01 | [Custom Hook Extraction](./01-custom-hook-extraction/) | ⭐ Easy | ロジックをカスタムフックに抽出 |
| 02 | [Component Separation](./02-component-separation/) | ⭐ Easy | 大きなコンポーネントを分割 |
| 03 | [Props Design](./03-props-design/) | ⭐⭐ Medium | Props インターフェースの改善 |
| 04 | [State Management](./04-state-management/) | ⭐⭐ Medium | useState から Context/Reducer へ |
| 05 | [Performance Memo](./05-performance-memo/) | ⭐⭐ Medium | React.memo による再レンダリング防止 |
| 06 | [useCallback Optimization](./06-use-callback-optimization/) | ⭐⭐ Medium | useCallback で関数参照を安定化 |
| 07 | [Context Refactor](./07-context-refactor/) | ⭐⭐ Medium | Context API の効果的な活用 |
| 08 | [Reducer Pattern](./08-reducer-pattern/) | ⭐⭐⭐ Hard | useReducer による複雑な状態管理 |

## 🎯 推奨学習順

1. **基礎**（Easy）
   - 01: Custom Hook - ロジック抽出
   - 02: Component Separation - コンポーネント分割

2. **実践**（Medium）
   - 03: Props Design - Props の設計
   - 04: State Management - 状態管理の進化
   - 05: Performance Memo - 再レンダリング防止
   - 06: useCallback - 関数参照の安定化
   - 07: Context Refactor - グローバル状態

3. **応用**（Hard）
   - 08: Reducer Pattern - 複雑な状態管理

## 💡 学習ポイント

### カスタムフック
コンポーネントロジックの再利用。

```typescript
const useFormInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  return { value, setValue, bind: { value, onChange: (e) => setValue(e.target.value) } };
};
```

### コンポーネント分割
- 単一責任の原則
- テストしやすいコンポーネント設計
- 再利用性の向上

### Props の設計
```typescript
// ❌ 悪い例
<Button onClick={handleClick} disabled={isLoading} label="Submit" />

// ✅ 良い例
<Button onClick={handleClick} isLoading={isLoading} label="Submit" />
```

### パフォーマンス最適化
- `React.memo`: 不要な再レンダリング防止
- `useMemo`: 計算結果のメモ化
- `useCallback`: 関数参照の安定化

### Context API
グローバル状態管理の効果的な活用。

### useReducer
複雑な状態ロジックの管理。

---

**ルートREADME**: [../README.md](../README.md)
