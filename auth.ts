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
      async authorize(credentials) {
        // 認証情報の検証
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // 認証情報の検証後、DBからユーザーを問い合わせる
          const user = await getUser(email);
          if (!user) return null;

          // ユーザーデータ取得後、
          // ユーザーがformで入力したパスワード（password）と、
          // getUserから取得したパスワード（user.password）が一致するかチェック
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;

        }

        console.log('Invalid credentials');
        return null;
      }
    }),
  ],
});
