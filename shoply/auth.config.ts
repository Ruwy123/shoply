import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized: ({ request, auth }: any) => {
      //check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        //clone the req header
        const newRequestHeaders = new Headers(request.headers);

        //create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        //set newly generated session cart id in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
