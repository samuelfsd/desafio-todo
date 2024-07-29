import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'email', type: 'text'},
        password: {label: 'password', type: 'text'}
      },

      async authorize(credentials, req) {
        try {
          const response = await fetch('http://localhost:3333/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data.user) {
            return null;
          }

          return{ ...data.user, token: data.token}
        } catch (error) {
          console.error('Error in authorize function:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
		async jwt({ token, user }) {
      if(user) {
        token.user = user
      }
			return token
		},
		async session({ session, token }){
			session = token.user as any
			return session
		}
	}
}

const handler = NextAuth(nextAuthOptions)

export {handler as GET, handler as POST, nextAuthOptions}