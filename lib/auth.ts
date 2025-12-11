import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "./user-helpers";
import bcrypt from "bcryptjs";

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          console.log("[AUTH] Authorize called with email:", credentials?.email);
          
          if (!credentials?.email || !credentials.password) {
            console.log("[AUTH] Missing credentials");
            return null;
          }

          const email = String(credentials.email).toLowerCase().trim();
          const password = String(credentials.password);
          console.log("[AUTH] Looking for user with email:", email);
          
          let user;
          try {
            user = await findUserByEmail(email);
            console.log("[AUTH] User found:", user ? { id: user.id, email: user.email, role: user.role } : "null");
          } catch (dbError) {
            console.error("[AUTH] Database error:", dbError);
            throw dbError;
          }

          // User must exist in database
          if (!user) {
            console.log("[AUTH] User not found");
            return null;
          }

          // User must have ADMIN role
          if (user.role !== "ADMIN") {
            console.log("[AUTH] User role is not ADMIN:", user.role);
            return null;
          }

          // Password must match
          console.log("[AUTH] Comparing password...");
          let valid;
          try {
            valid = await bcrypt.compare(password, user.password);
            console.log("[AUTH] Password match:", valid);
          } catch (bcryptError) {
            console.error("[AUTH] Bcrypt error:", bcryptError);
            return null;
          }
          
          if (!valid) {
            console.log("[AUTH] Password does not match");
            return null;
          }

          // All checks passed - return user
          console.log("[AUTH] All checks passed, returning user");
          return {
            id: user.id,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error("[AUTH] Error in authorize:", error);
          console.error("[AUTH] Error stack:", error instanceof Error ? error.stack : "No stack");
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  trustHost: true, // Required for Vercel deployments
  pages: {
    signIn: "/admin/login"
  },
  debug: process.env.NODE_ENV === "development"
});


