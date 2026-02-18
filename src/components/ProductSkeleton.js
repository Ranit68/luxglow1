export default function ProductSkeleton() {
  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-6 animate-pulse">
      <div className="max-w-7xl mx-auto py-16 grid md:grid-cols-2 gap-14">

        {/* IMAGE SKELETON */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="w-full h-[550px] bg-gray-200 rounded-2xl"></div>
        </div>

        {/* TEXT SKELETON */}
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>

          <div className="space-y-3 mt-6">
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          </div>

          <div className="space-y-3 mt-8">
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
          </div>

          <div className="h-14 bg-gray-300 rounded-full w-40 mt-10"></div>
        </div>

      </div>
    </main>
  );
}
