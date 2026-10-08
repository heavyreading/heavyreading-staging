// Inner tier gate: only requests carrying the inner cookie may see /inner/*.
//
// A small set of readers sees a slightly different site: pages under /inner/
// (e.g. the exact WTI CMA model) are invisible to everyone else. Outsiders
// get a plain 404; the section does not advertise its existence, and it is
// excluded from nav, sitemap, and robots. The cookie is set via
// /inner/auth?key=<token>; the token is shared out-of-band with members
// only. If the link ever leaks, rotate INNER_TOKEN and re-share.
const INNER_TOKEN = "82703f80abad3807b43f415fb3021e6f0d5b662e083223d7";
const COOKIE = "hr_inner";

function authed(request) {
  const c = request.headers.get("Cookie") || "";
  return c.split(";").some(function (p) {
    return p.trim() === COOKIE + "=" + INNER_TOKEN;
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  // The auth endpoint itself must stay reachable.
  if (url.pathname === "/inner/auth" || url.pathname === "/inner/auth/") {
    return context.next();
  }
  if (!authed(context.request)) {
    return new Response("Not found", { status: 404 });
  }
  return context.next();
}
