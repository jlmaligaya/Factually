import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const authOptions = {
    session: {
        strategy: "jwt",
        
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {},
            async authorize(credentials, req) {
                const { email, password } = credentials;

                // perform you login logic
                const user = await prisma.user.findUnique({
                    where: {
                      email,
                    },
                  })
                

                if (email !== user.email || password !== user.password) {
                    throw new Error("invalid credentials");
                }
                // if everything is fine
                return user
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        // error: '/auth/error',
        // signOut: '/auth/signout'
    },
    callbacks: {
        async session({ session, token }) {
            // Get user from token
            const user = await prisma.user.findUnique({
              where: {
                email: token.email
              }
            });
        
            // Add the additional user data to the session object
            session.user.email= user.email;
            session.user.firstName= user.firstName;
            session.user.lastName= user.lastName;
            session.user.uid= user.uid;
            session.user.exp = user.exp;
            session.user.level= user.level;
            session.user.username = user.username;

            return session;
          }
    },
};
export default NextAuth(authOptions);
