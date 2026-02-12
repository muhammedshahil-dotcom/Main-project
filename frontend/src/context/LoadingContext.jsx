import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { LoadingContext } from "./LoadingContextBase";

export const LoadingProvider = ({ children }) => {
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        setPendingRequests((count) => count + 1);
        return config;
      },
      (error) => {
        setPendingRequests((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setPendingRequests((count) => Math.max(0, count - 1));
        return response;
      },
      (error) => {
        setPendingRequests((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = useMemo(
    () => ({ isLoading: pendingRequests > 0 }),
    [pendingRequests]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};
