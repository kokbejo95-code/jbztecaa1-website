export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // =========================
    // LOGIN
    // =========================
    if (url.pathname === "/login") {
      const body = await request.json();

      if (
        body.user === env.ADMIN_USER &&
        body.pass === env.ADMIN_PASS
      ) {
        return Response.json(
          { ok: true, token: "admin-ok" },
          { headers: cors }
        );
      }

      return Response.json(
        { ok: false, message: "Invalid login" },
        { headers: cors }
      );
    }

    // =========================
    // PUBLISH POST TO GITHUB
    // =========================
    if (url.pathname === "/publish") {

      const post = await request.json();

      const filePath = `posts/${post.slug}.json`;
      const content = btoa(JSON.stringify(post));

      const githubResponse = await fetch(
        `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `token ${env.GH_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: "new post",
            content: content
          })
        }
      );

      const data = await githubResponse.json();

      return new Response(JSON.stringify({
        ok: true,
        result: data
      }), { headers: cors });
    }

    // =========================
    // DEFAULT RESPONSE
    // =========================
    return new Response(
      JSON.stringify({ status: "CMS Worker Running" }),
      { headers: cors }
    );
  }
};