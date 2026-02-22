export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md animate-pulse">

      {/* IMAGE */}
      <div className="h-64 bg-gray-200"></div>

      {/* DETAILS */}
      <div className="p-5 space-y-3">

        <div className="h-4 bg-gray-200 rounded w-3/4"></div>

        <div className="h-3 bg-gray-200 rounded w-1/2"></div>

        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        </div>

      </div>
    </div>
  );
}