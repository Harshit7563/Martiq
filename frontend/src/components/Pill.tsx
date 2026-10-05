export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-stone-200 bg-white px-2 py-0.5 text-xs text-stone-600">
      {children}
    </span>
  )
}
