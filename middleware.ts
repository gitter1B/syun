import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isLoginPage = nextUrl.pathname.startsWith("/login");
  if (isAuthRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }
  if (!isLoggedIn && !isLoginPage) {
    if (isApiRoute) {
      if (isAuthRoute) {
        return Response.redirect(new URL("/login", nextUrl));
      }
    } else {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
