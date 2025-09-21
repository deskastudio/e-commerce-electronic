// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmailOrPhone } from "@/lib/database/services/user-service";

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
    signIn: "/auth/login",
    error: "/auth/error",
    // Tidak perlu signUp page karena kita handle manual
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
      
      // Redirect admin ke dashboard admin
      if (url.includes('callbackUrl=/admin') || url.includes('/admin')) {
        return `${baseUrl}/admin`;
      }
      
      // Redirect ke auth/login untuk sign in
      if (url.includes('/api/auth/signin')) {
        return `${baseUrl}/auth/login`;
      }
      
      // Handle logout redirect
      if (url.includes('/api/auth/signout')) {
        return baseUrl;
      }
      
      // Izinkan URL relatif
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Default ke home
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