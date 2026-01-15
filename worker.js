// worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/posts") {
      let storedPosts = await env.KV.get("posts");
      if (storedPosts) {
        return new Response(storedPosts, {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "POST" && url.pathname === "/post") {
      const body = await request.json();
      let storedPosts = await env.KV.get("posts");
      const postsArray = storedPosts ? JSON.parse(storedPosts) : [];
      postsArray.push({ content: body.content, timestamp: Date.now() });
      await env.KV.put("posts", JSON.stringify(postsArray));
      return new Response("Post added", { status: 200 });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return fetch("https://forum-worker.kzhangas.workers.dev/index.html");

    }

    return new Response("Not Found", { status: 404 });
  },
};