export default function CartItemSkeleton() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow flex gap-6 animate-pulse">

      <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>

      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

        <div className="flex gap-3 mt-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

    </div>
  );
}