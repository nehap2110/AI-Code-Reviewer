function Loader({ label = "Analyzing your code..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <div className="w-10 h-10 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default Loader;