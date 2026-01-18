// ❌ リファクタリング前: コールバック地獄

interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  userId: string;
  title: string;
}

/**
 * コールバック地獄の典型例
 */
export function fetchUserPostsCallback(userId: string, callback: (error?: Error, data?: any) => void): void {
  // ユーザー情報を取得
  fetch(`/api/users/${userId}`)
    .then((res) => {
      // ネスト 1
      res.json().then((user: User) => {
        // ネスト 2
        // ユーザーの投稿を取得
        fetch(`/api/users/${user.id}/posts`)
          .then((postsRes) => {
            // ネスト 3
            postsRes.json().then((posts: Post[]) => {
              // ネスト 4
              // 各投稿のコメントを取得
              const postIds = posts.map((p) => p.id);
              const allComments: any[] = [];

              postIds.forEach((postId, index) => {
                // ネスト 5
                fetch(`/api/posts/${postId}/comments`)
                  .then((commentsRes) => {
                    // ネスト 6
                    commentsRes.json().then((comments) => {
                      // ネスト 7
                      allComments.push(...comments);

                      if (index === postIds.length - 1) {
                        callback(undefined, {
                          user,
                          posts,
                          comments: allComments,
                        });
                      }
                    });
                  })
                  .catch((err) => callback(err));
              });
            });
          })
          .catch((err) => callback(err));
      });
    })
    .catch((err) => callback(err));
}
