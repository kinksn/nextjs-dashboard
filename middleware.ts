// middreware.tsは特別なファイルで、リクエストが完了する前にコードを実行できる
// ここではNextAuth.jsをauthConfigオブジェクトで初期化してauthプロパティをエクスポートしている
// また、matcherオプションを使って特定のパスで実行するように設定している
import NextAuth from 'next-auth';

//　middlewareで実行したいのはログイン状況によってリダイレクトする処理のみなので、
// auth.tsからではなくauth.config.tsから authConfig をインポートしている
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // matcherはミドルウェアが実行されるべきURLのパターンを指定している
  // ここではネガティブルックアヘッド（?!）を指定しているため、
  // api、_next/static、_next/imageで始まる、または.pngで終わるURLを除くすべてのパスにマッチする
  // Document: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  /*
  * Match all request paths except for the ones starting with:
  * - api (API routes)
  * - _next/static (static files)
  * - _next/image (image optimization files)
  * - .png (png image file)
  */
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
