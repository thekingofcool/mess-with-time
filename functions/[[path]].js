
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // If this is an API request, let the API handler deal with it
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }
  
  // For all other paths, serve the main application
  const response = await context.env.ASSETS.fetch(new Request(new URL('/', url)));
  return response;
}
