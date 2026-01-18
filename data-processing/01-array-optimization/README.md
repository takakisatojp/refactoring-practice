# 01: Array Optimization（配列操作の最適化）

## 学習目標

- ✅ map/filter/reduce の効率的な使用
- ✅ 複数パスの削減
- ✅ パフォーマンス改善

## 問題点

配列処理を複数回のループで行うと、非効率になります：

```typescript
const users = [...]
const names = [];
for (const user of users) {
  names.push(user.name);
}

const filtered = [];
for (const name of names) {
  if (name.length > 3) {
    filtered.push(name);
  }
}
```

## ゴール

map/filter/reduce を活用して最適化を達成：

1. ✅ 複数ループを1つにまとめる
2. ✅ 配列メソッドを適切に使う
3. ✅ パフォーマンスを改善

---

**難易度**: ⭐ Easy | **所要時間**: 15-20分
