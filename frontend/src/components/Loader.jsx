function Loader({ label = "Analyzing your code..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--text-muted)]">
      <div
        className="w-10 h-10 rounded-full animate-spin"
        style={{ border: "4px solid var(--border)", borderTopColor: "var(--brand)" }}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default Loader;
