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
                return {
                  
                    name: user.firstName + ' ' + user.lastName,
                    email: user.email,
                    
                    
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        // error: '/auth/error',
        // signOut: '/auth/signout'
    },
    callbacks: {
        jwt(params) {
            var _a;
            // update token
            if ((_a = params.user) === null || _a === void 0 ? void 0 : _a.role) {
                params.token.role = params.user.role;
            }
            // return final_token
            return params.token;
        },
    },
};
export default NextAuth(authOptions);
