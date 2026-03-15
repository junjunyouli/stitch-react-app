// import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "./trpc";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);