import { onRequest as trpcHandler } from "./trpc_handler";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  
  if (url.pathname.startsWith("/api/trpc/")) {
    return trpcHandler(context);
  }

  return context.next();
};
