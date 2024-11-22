// Importing HTTP server from Deno standard library
import { serve } from "https://deno.land/std@0.207.0/http/server.ts";

// WebSocket Connection Handler
function handleWebSocket(socket: WebSocket) {
  console.log("WebSocket connected");

  // Handling incoming messages
  socket.onmessage = (event) => {
    if (typeof event.data === "string") {
      console.log(`Received: ${event.data}`);
      socket.send(`Echo: ${event.data}`); // Echo back the message
    } else if (event.data instanceof Uint8Array) {
      console.log("Binary data received");
    }
  };

  // Handling close event
  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  // Handling error event
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
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
