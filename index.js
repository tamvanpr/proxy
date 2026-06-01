export default {
  async fetch(request) {
    const reqUrl = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    const target = reqUrl.searchParams.get("url");

    if (!target) {
      return new Response("Missing ?url=", {
        status: 400,
        headers: corsHeaders()
      });
    }

    let targetUrl;

    try {
      targetUrl = new URL(target);
    } catch {
      return new Response("Invalid target URL", {
        status: 400,
        headers: corsHeaders()
      });
    }

    const headers = new Headers();

    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36");
    headers.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8");
    headers.set("Accept-Language", "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7");
    headers.set("Referer", targetUrl.origin + "/");
    headers.set("Origin", targetUrl.origin);

    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers,
      redirect: "follow"
    });

    const resHeaders = new Headers(response.headers);

    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    resHeaders.set("Access-Control-Allow-Headers", "*");
    resHeaders.set("Access-Control-Expose-Headers", "*");

    resHeaders.delete("content-security-policy");
    resHeaders.delete("content-security-policy-report-only");
    resHeaders.delete("x-frame-options");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders
    });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*"
  };
}
