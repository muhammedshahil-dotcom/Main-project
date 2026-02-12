import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContextBase";

const GlobalLoader = () => {
  const { isLoading } = useContext(LoadingContext);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
    </div>
  );
};

export default GlobalLoader;
