// Same-origin proxy for monthly CMA grids in R2.
//
// The inner CMA page fetches /api/cma/2026-10 instead of the R2 public URL
// directly (same CORS reason as /api/quotes). Only YYYY-MM months are
// served; anything else is a 400.
const R2_BASE =
  "https://pub-9df98d7efbc74d9fbe1dfe6431229e0e.r2.dev";

export async function onRequest(context) {
  const ym = context.params.ym || "";
  if (!/^\d{4}-\d{2}$/.test(ym)) {
    return new Response("bad month", { status: 400 });
  }
  const upstream = await fetch(R2_BASE + "/cma/" + ym + ".json");
  if (!upstream.ok) {
    return new Response("not found", { status: upstream.status });
  }
  const body = await upstream.arrayBuffer();
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
