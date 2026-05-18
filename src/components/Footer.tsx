export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-sm text-zinc-500 md:flex-row md:items-center">
        <div>
          © {new Date().getFullYear()} AlphaForge AI · Built by{" "}
          <a href="https://github.com/XinnBlueBird" className="text-zinc-300 hover:text-white">
            XinnBlueBird
          </a>
        </div>
        <div className="flex gap-4">
          <a href="https://github.com/XinnBlueBird/alphaforge-ai" className="hover:text-white">
            GitHub
          </a>
          <a href="https://x.com/Xinnsky" className="hover:text-white">
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
