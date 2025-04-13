// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmailOrPhone } from "@/lib/user-db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password diperlukan");
        }
      
        try {
          // Get user from database
          const user = await getUserByEmailOrPhone(credentials.email);
          
          if (!user) {
            throw new Error("Email atau nomor telepon tidak terdaftar");
          }
          
          // Verify password
          const isValid = await user.comparePassword(credentials.password);
          
          if (!isValid) {
            throw new Error("Password salah");
          }
          
          // Return user data to be stored in session
          return {
            id: user.id,
            name: user.name,
            email: user.email || user.phone,
            isAdmin: user.role === 'admin'
          };
        } catch (error) {
          throw new Error((error as Error).message || "Terjadi kesalahan saat login");
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/login", // Diubah dari "/login" ke "/auth/login" sesuai URL yang diakses
    error: "/auth/error", // Diubah juga untuk konsistensi
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Jika URL dimulai dengan baseUrl, ini adalah link internal
      if (url.startsWith(baseUrl)) return url;
      
      // Jika URL adalah callbackUrl untuk admin
      if (url.includes('callbackUrl=/admin')) {
        return `${baseUrl}/admin`;
      }
      
      // Jika URL adalah sign in default NextAuth
      if (url.includes('/api/auth/signin')) {
        return `${baseUrl}/auth/login`; // Diubah untuk konsistensi
      }
      
      // Izinkan URL relatif
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Default ke URL dasar
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };