import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import { LoadingContext } from "./LoadingContextBase";

export const LoadingProvider = ({ children }) => {
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (config?.skipGlobalLoader) return config;
        setPendingRequests((count) => count + 1);
        return config;
      },
      (error) => {
        if (error?.config?.skipGlobalLoader) return Promise.reject(error);
        setPendingRequests((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        if (response?.config?.skipGlobalLoader) return response;
        setPendingRequests((count) => Math.max(0, count - 1));
        return response;
      },
      (error) => {
        if (error?.config?.skipGlobalLoader) return Promise.reject(error);
        setPendingRequests((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    if (pendingRequests > 0) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (!showTimerRef.current) {
        // Prevent brief requests from flashing a full-screen overlay.
        showTimerRef.current = setTimeout(() => {
          setIsLoading(true);
          showTimerRef.current = null;
        }, 350);
      }
      return;
    }

    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (isLoading) {
      hideTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        hideTimerRef.current = null;
      }, 120);
    }
  }, [pendingRequests, isLoading]);

  const value = useMemo(
    () => ({ isLoading }),
    [isLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};
