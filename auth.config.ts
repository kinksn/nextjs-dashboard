import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  /**
  * pagesオプション（任意）
  *
  * カスタムサインイン、サインアウト、エラーページのルートを指定できる。
  * `signIn: '/login'`を追加することでNextAuth.jsのデフォルトページでなく、
  * カスタムログインページにリダイレクトさせる
  */
  pages: {
    signIn: '/login',
  },
  /**
  * callbacksオプション（任意）
  *
  * authrizedコールバックはリクエストがNext.jsのミドルウェア経由でページにアクセスすることが許可されているかを確認するために使う。
  * リクエストが完了する前に呼び出されてauth,requestプロパティを持つオブジェクトを受け取る。
  * authにはユーザーのセッションが含まれ、requestには受診したリクエストが含まれる
  */
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  /**
  * callbacksオプション（必須）
  *
  * ログインオプションを複数指定することができる配列。
  */
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
