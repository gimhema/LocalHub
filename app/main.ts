// Importing HTTP server from Deno standard library
import { serve } from "https://deno.land/std@0.207.0/http/server.ts";

// WebSocket Connection Handler
async function handleWebSocket(socket: WebSocket) {
  console.log("WebSocket connected");

  for await (const message of socket) {
    if (typeof message === "string") {
      console.log(`Received: ${message}`);
      socket.send(`Echo: ${message}`); // Echo back the message
    } else if (message instanceof Uint8Array) {
      console.log("Binary data received");
    } else if (message === "close") {
      console.log("WebSocket connection closed");
    }
  }
}

// HTTP Server with WebSocket upgrade
serve(async (req: Request) => {
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req); // WebSocket upgrade
    handleWebSocket(socket); // Pass the socket to the handler
    return response;
  }

  // Fallback for HTTP requests
  return new Response("This is a WebSocket server. Connect via WebSocket.", {
    status: 200,
  });
}, { port: 8080 });

console.log("WebSocket server is running at ws://localhost:8080");
