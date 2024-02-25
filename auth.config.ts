// このファイルではログイン状況を判定し、
// 適切なページへリダイレクトするための設定をしている

import type { NextAuthConfig } from 'next-auth';

/**
* authConfigオブジェクトはMiddlewareファイル（middleware.ts）にインポートする必要がある。
* @see {@link https://nextjs.org/docs/app/building-your-application/routing/middleware}
*/
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
  * authにはユーザーのセッションが含まれ、requestには受信したリクエストが含まれる
  */
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      /**
      * 未ログイン時
      auth =  null

      nextUrl =  {
        href: 'http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard',
        origin: 'http://localhost:3000',
        protocol: 'http:',
        username: '',
        password: '',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/login',
        search: '?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard',
        searchParams: URLSearchParams {
        [Symbol(query)]: [ 'callbackUrl', 'http://localhost:3000/dashboard' ],
        [Symbol(context)]: URL {
        [Symbol(context)]: URLContext {
        href: 'http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard',
        protocol_end: 5,
        username_end: 7,
        host_start: 7,
        host_end: 16,
        pathname_start: 21,
        search_start: 27,
        hash_start: 4294967295,
        port: 3000,
        scheme_type: 0
      }
      }
      },
        hash: ''
      }
      */

      /**
      * ログイン後
      auth =  {
        user: { name: 'User', email: 'user@nextmail.com' },
        expires: '2024-03-26T04:19:33.195Z'
      }

      nextUrl =  {
        href: 'http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard',
        origin: 'http://localhost:3000',
        protocol: 'http:',
        username: '',
        password: '',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/login',
        search: '?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard',
        searchParams: URLSearchParams {
        [Symbol(query)]: [ 'callbackUrl', 'http://localhost:3000/dashboard' ],
        [Symbol(context)]: URL {
        [Symbol(context)]: URLContext {
        href: 'http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard',
        protocol_end: 5,
        username_end: 7,
        host_start: 7,
        host_end: 16,
        pathname_start: 21,
        search_start: 27,
        hash_start: 4294967295,
        port: 3000,
        scheme_type: 0
      }
      }
      },
        hash: ''
      }
      auth =  {
        user: { name: 'User', email: 'user@nextmail.com' },
        expires: '2024-03-26T04:19:33.195Z'
      }
      nextUrl =  {
        href: 'http://localhost:3000/dashboard',
        origin: 'http://localhost:3000',
        protocol: 'http:',
        username: '',
        password: '',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/dashboard',
        search: '',
        searchParams: URLSearchParams {
        [Symbol(query)]: [],
        [Symbol(context)]: URL {
        [Symbol(context)]: URLContext {
        href: 'http://localhost:3000/dashboard',
        protocol_end: 5,
        username_end: 7,
        host_start: 7,
        host_end: 16,
        pathname_start: 21,
        search_start: 4294967295,
        hash_start: 4294967295,
        port: 3000,
        scheme_type: 0
      }
      }
      },
        hash: ''
      }
      */

      // nullをbool値に変換するための`!!`
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
  * providersオプション（必須）
  *
  * ログインオプションを複数指定することができる配列。
  * このオプションはauth.tsで設定している。
  * 設定内容はログインフォームで入力した項目を検証し、
  * nullか { email: 'user@nextmail.com', password: '123456' } を返す処理
  */
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
