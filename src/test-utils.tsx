import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { AppRouter } from "../functions/router";

export const trpc = createTRPCReact<AppRouter>();

export function createTestWrapper() {
    const queryClient = new QueryClient();

    const trpcClient = trpc.createClient({
        links: [
            httpBatchLink({
                url: "http://localhost:8787/api/trpc",
            }),
        ],
    });

    return function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </trpc.Provider>
        );
    };
}