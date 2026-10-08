// /inner/auth?key=<token> — inner tier entry point.
//
// With the right key, sets the long-lived hr_inner cookie and drops the
// member onto /inner/. Wrong or missing key: 404, same as the rest of /inner/.
const INNER_TOKEN = "82703f80abad3807b43f415fb3021e6f0d5b662e083223d7";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.searchParams.get("key") !== INNER_TOKEN) {
    return new Response("Not found", { status: 404 });
  }
  const res = Response.redirect(url.origin + "/inner/", 302);
  res.headers.set(
    "Set-Cookie",
    "hr_inner=" + INNER_TOKEN + "; Path=/inner; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax"
  );
  return res;
}
