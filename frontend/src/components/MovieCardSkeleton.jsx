const MovieCardSkeleton = () => {
  return (
    <div className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] animate-pulse">
      <div className="h-[210px] sm:h-[270px] md:h-[300px] rounded-lg bg-gray-800" />
      <div className="mx-auto mt-2 h-4 w-3/4 rounded bg-gray-800" />
    </div>
  );
};

export default MovieCardSkeleton;
