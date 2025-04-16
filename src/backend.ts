import index from "./frontend/index.html";

const server = Bun.serve({
  port: 3000,
  // development: false,
  routes: {
    /**
     * Client
     */
    "/": index,

    // "/favicon.ico": new Response(
    //   await Bun.file("./client/assets/favicon.ico").bytes(),
    //   {
    //     headers: {
    //       "Content-Type": "image/x-icon",
    //     },
    //   }
    // ),

    /**
     * API
     */
    "/api/status": new Response("OK"),

    "/users/:id": (req) => {
      return new Response(`Hello User ${req.params.id}!`);
    },

    "/api/posts": {
      GET: () => new Response("List posts"),
      POST: async (req) => {
        const body = await req.json();
        return Response.json({ created: true, ...body });
      },
    },
  },

  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`listening http://localhost:${server.port}/`);
