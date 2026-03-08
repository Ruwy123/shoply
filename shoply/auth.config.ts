import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized: ({ request, auth }: any) => {
      //array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      //get pathname from the requrest url object
      const { pathname } = request.nextUrl;
      //check if user is not authenticated and is trying to access protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

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
