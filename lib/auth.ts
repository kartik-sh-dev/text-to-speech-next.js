import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// 🔐 User database - Add your credentials here
// To add a new user, add an object with id, email, and hashed password
const users = [
  {
    id: "1",
    email: "test@test.com",
    password: bcrypt.hashSync("123456", 10),
  },
  // Add more users here:
  // {
  //   id: "2",
  //   email: "your@email.com",
  //   password: bcrypt.hashSync("yourpassword", 10),
  // },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        // Find user by email
        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          console.log("❌ User not found:", credentials.email);
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          console.log("❌ Invalid password for:", credentials.email);
          return null;
        }

        console.log("✅ Login successful:", user.email);

        // Return user object (don't include password!)
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token on login
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development", // Enable debug in dev mode
};