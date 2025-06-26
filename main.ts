// main.ts
// Deno Deploy static file server for React build output

import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const BUILD_DIR = "./build";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  // Serve static files from build directory
  const fileResponse = await serveDir(req, {
    fsRoot: BUILD_DIR,
    urlRoot: "",
    showDirListing: false,
    quiet: true,
  });

  // If file not found, serve index.html for SPA routing
  if (fileResponse.status === 404) {
    const indexFile = await Deno.readFile(`${BUILD_DIR}/index.html`);
    return new Response(indexFile, {
      status: 200,
      headers: { "content-type": "text/html" },
    });
  }

  return fileResponse;
}); 