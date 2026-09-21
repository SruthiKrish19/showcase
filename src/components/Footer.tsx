export function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-faint">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet to-cyan" />
          <span className="h-2.5 w-2.5 rounded-full border border-white/20" />
        </div>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
