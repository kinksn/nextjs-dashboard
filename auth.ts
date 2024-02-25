import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// 認証情報プロバイダー（Credentials）を追加している
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string) {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // NextAuth.jsのプロバイダーオプションを追加している
  // プロバイダーとは、GoogleやGitHubなどサービスのログインオプションを複数設定することができる配列
  // ここではCredentialsプロバイダーだけを使う
  // Credentialsを使うとユーザー名とパスワードでログインできるようになる
  providers: [
    Credentials({
      // 返り値はnullかオブジェクト（ここでは`user = { email: 'user@nextmail.com', password: '123456' }`）
      async authorize(credentials) {
        /**
        * 正常系のデータ入力時
        * 元データはaction.tsで呼び出されているsignIn('credentials', formData)からの`formData`
        *
        credentials =  {
          '$ACTION_REF_1': '',
          '$ACTION_1:0': '{"id":"b8b7f347c09d3281ec22ecd55a4e93d7376db5ac","bound":"$@1"}',
          '$ACTION_1:1': '["$undefined"]',
          '$ACTION_KEY': 'k4156757892',
          email: 'user@nextmail.com',
          password: '123456',
          callbackUrl: 'http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard'
        }
        */

        // 認証情報の検証
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        // safeParseが成功すれば `success: true` になる
        if (parsedCredentials.success) {
          /**
          * safeParseしたオブジェクトから必要なプロパティを抽出
          * {
            success: true,
            data: { email: 'user@nextmail.com', password: '123456' }
          }
          */
          const { email, password } = parsedCredentials.data;

          // 認証情報の検証後、DBからユーザーを問い合わせる
          const user = await getUser(email);
          if (!user) return null;

          // ユーザーデータ取得後、
          // ユーザーがformで入力したパスワード（password）と、
          // getUserから取得したパスワード（user.password）が一致するかチェック
          const passwordMatch = await bcrypt.compare(password, user.password);

          // passwordが一致すればユーザー（`{ email: 'user@nextmail.com', password: '123456' }`）を返す
          if (passwordMatch) return user;

        }

        console.log('Invalid credentials');
        // safeParseが失敗 or passwordが一致しなければnullを返す
        return null;
      }
    }),
  ],
});
