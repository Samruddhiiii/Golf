import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
            return null;
        }
        
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                }),
                headers: { "Content-Type": "application/json" }
            });
            
            const user = await res.json();
            
            if (res.ok && user) {
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: user.token
                };
            }
        } catch(e) {
            return null;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    }
  },
  session: {
      strategy: "jwt",
  },
  pages: {
      signIn: "/login",
  }
});

export { handler as GET, handler as POST };
