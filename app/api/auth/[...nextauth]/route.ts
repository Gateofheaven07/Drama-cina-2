import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Mohon masukkan email dan kata sandi");
        }
        
        const normalizedEmail = credentials.email.toLowerCase();
        
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        });
        
        if (!user || user.password === "") {
          throw new Error("Email belum terdaftar atau Anda masuk menggunakan akun Google");
        }
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Kata sandi salah");
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        const normalizedEmail = user.email.toLowerCase();
        
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: normalizedEmail,
                name: user.name || "User",
                password: "", // User SSO Google tidak perlu password
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Gagal menyimpan data user ke database:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Hanya berjalan saat pertama kali login (ketika objek user ada dari provider)
      if (user) {
        // Jika login dengan credentials, user.id sudah ada dari authorize()
        if (account?.provider === "credentials") {
          token.id = user.id;
        } else {
          // Jika login dengan google, cari ID di database berdasarkan email
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email as string },
          });
          if (dbUser) {
            token.id = dbUser.id;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };


