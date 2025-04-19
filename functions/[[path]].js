
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Explicit handling for API requests
  if (url.pathname.startsWith('/api/')) {
    console.log("API request detected:", url.pathname);
    
    // Use a direct path to the API function handler - force it to process API requests
    return await context.env.ASSETS.fetch(`${url.origin}/api${url.pathname.slice(4)}${url.search}`, {
      headers: context.request.headers,
      method: context.request.method,
    });
  }
  
  // For all other paths, serve the main application
  console.log("Non-API request, serving main application");
  return context.env.ASSETS.fetch(new Request(url));
}
