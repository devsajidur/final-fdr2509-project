export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 bg-[#F9FAFB]">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-amber-500 animate-spin"></div>
        <div className="absolute w-3 h-3 rounded-full bg-amber-500"></div>
      </div>
      <p className="mt-4 text-[13px] font-semibold text-gray-500 tracking-wider uppercase font-mono">
        Loading Mack Anthem Portal...
      </p>
    </div>
  );
}
