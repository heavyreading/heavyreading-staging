// Same-origin proxy for the quotes JSON in R2.
//
// The /quotes/ page fetches /api/quotes instead of the R2 public URL
// directly. The R2 bucket has no CORS policy (and the API token cannot set
// one), so cross-origin browser fetches are blocked and the page sticks on
// "loading". This function relays the JSON server-side with a short edge
// cache; data still refreshes every 15 min via the quotes-refresh cron
// (bin/pull_quotes.py + bin/upload_quotes_r2.py) — no Pages rebuilds.
const R2_QUOTES =
  "https://pub-9df98d7efbc74d9fbe1dfe6431229e0e.r2.dev/quotes/quotes.json";

export async function onRequest() {
  const upstream = await fetch(R2_QUOTES);
  const body = await upstream.arrayBuffer();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=180",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
