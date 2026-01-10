import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 🔐 Load users from environment variables
// Format: USER_1_EMAIL=test@test.com USER_1_PASSWORD=password123
function getUsersFromEnv() {
  const users = [];
  let index = 1;

  while (process.env[`USER_${index}_EMAIL`]) {
    const email = process.env[`USER_${index}_EMAIL`];
    const password = process.env[`USER_${index}_PASSWORD`];

    if (email && password) {
      users.push({
        id: index.toString(),
        email,
        password, // Plain text from env
      });
    }
    index++;
  }

  // Fallback to default if no users configured (for development)
  if (users.length === 0) {
    console.warn("⚠️ No users found in environment variables");
    console.warn("⚠️ Add USER_1_EMAIL and USER_1_PASSWORD to your .env.local");
    return [];
  }

  console.log("✅ Loaded users from environment:", users.map(u => u.email).join(", "));
  return users;
}

const users = getUsersFromEnv();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        // Check if any users are configured
        if (users.length === 0) {
          console.log("❌ No users configured in environment variables");
          return null;
        }

        // Find user (case-insensitive email)
        const user = users.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );

        if (!user) {
          console.log("❌ User not found:", credentials.email);
          return null;
        }

        // Simple plain text password comparison
        const isValid = credentials.password === user.password;

        if (!isValid) {
          console.log("❌ Invalid password for:", credentials.email);
          return null;
        }

        console.log("✅ Login successful:", user.email);

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};