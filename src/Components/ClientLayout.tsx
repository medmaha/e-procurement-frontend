"use client";
import React, { createContext, useRef } from "react";
import { ToastContainer } from "react-toastify";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type GlobalClientContext = {
  CACHE: Map<string, any>;
  updateCACHE: (key: string, value: any) => void;
};

export const GlobalClientContext = createContext({} as GlobalClientContext);

export default function ClientLayout(props: any) {
  const cache = useRef(new Map<string, any>());
  const updateCACHE = (key: string, value: any) => {
    cache.current.set(key, value);
  };

  return (
    <GlobalClientContext.Provider value={{ updateCACHE, CACHE: cache.current }}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        newestOnTop={true}
        limit={3}
        theme={props.theme === "dark" ? "colored" : "light"}
        className={"max-w-[65ch] w-max min-w-[30] md:min-w-[40ch]"}
      />
    </GlobalClientContext.Provider>
  );
}
