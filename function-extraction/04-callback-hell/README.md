# 04: Callback Hell（コールバック地獄の解消）

## 学習目標

- ✅ 深いネストされたコールバックを平坦化
- ✅ async/await の活用
- ✅ Promise チェーンの理解

## 問題点

複数の非同期操作をコールバックで実装すると、ネストが深くなります：

```typescript
function fetchData(callback) {
  fetch('/api/users').then(res => {
    res.json().then(users => {
      users.forEach(user => {
        fetch(`/api/posts/${user.id}`).then(postsRes => {
          postsRes.json().then(posts => {
            // ...深い...
          });
        });
      });
    });
  });
}
```

## ゴール

async/await で平坦化して、以下を達成してください：

1. ✅ ネストを1層に削減
2. ✅ コードが直線的に読める
3. ✅ エラーハンドリングが統一

---

**難易度**: ⭐⭐ Medium | **所要時間**: 20-25分
