import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

const authOptions = {
  secret: "73618696c457e815d8851a8d4190be3e",
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { identifier, password } = credentials;

        // Check by email
        const userByEmail = await prisma.user.findUnique({
          where: {
            email: identifier,
          },
        });

        // Check by username
        const userByUsername = await prisma.user.findUnique({
          where: {
            username: identifier,
          },
        });

        // If no matching user is found by email or username, return null.
        if (!userByEmail && !userByUsername) {
          throw new Error("No matching user");
          return null;
        }

        // Verify credentials
        // Verify hashed password
        let user = null;
        if (userByEmail) {
          const isValidPassword = await bcrypt.compare(
            password,
            userByEmail.password
          );
          if (isValidPassword) {
            user = userByEmail;
          }
        } else if (userByUsername) {
          const isValidPassword = await bcrypt.compare(
            password,
            userByUsername.password
          );
          if (isValidPassword) {
            user = userByUsername;
          }
        }

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Return the user based on either email or username
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      // Get user from token
      const user = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      // Add the additional user data to the session object

      session.user.email = user.email;
      session.user.firstName = user.firstName;
      session.user.lastName = user.lastName;
      session.user.uid = user.uid;
      session.user.exp = user.exp;
      session.user.level = user.level;
      session.user.username = user.username;
      session.user.avatar = user.avatar;
      session.user.role = user.role;
      session.user.section = user.section;
      session.user.section_handled = user.section_handled;
      return session;
    },
  },
};

export default NextAuth(authOptions);
