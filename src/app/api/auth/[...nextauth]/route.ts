import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInCredentials } from "#/src/types";

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as SignInCredentials;
        // send request to your api route where you can sign in you user and send error or success response to this function.
        const { user, error } = await fetch(
          "http://localhost:3000/api/users/signin",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        ).then(async (res) => await res.json());

        if (error) return null;
        return { id: user.id, ...user };
      },
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt(params: any) {
      if (params.user) {
        params.token.user = params.user;
      }
      return params.token;
    },
    async session(params: any) {
      const user = params.token.user;

      if (user) {
        params.session.user = { ...params.session.user, ...params.token.user };
      }
      return params.session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
