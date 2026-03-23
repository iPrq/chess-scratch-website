export const Footer = () => (
  <footer className="py-12 px-6 border-t border-slate-200 bg-slate-50/50">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
      <div className="text-xl font-extrabold tracking-tighter text-chess-dark">CheckMate</div>
      
      <div className="flex flex-wrap justify-center gap-8">
        {["Privacy Policy", "Terms of Service", "Support", "Careers"].map(link => (
          <a key={link} href="#" className="text-sm font-semibold text-slate-500 hover:text-chess-dark transition-colors">
            {link}
          </a>
        ))}
      </div>
      
      <div className="text-sm text-slate-400">
        © 2026 CheckMate. The Grandmaster's Choice.
      </div>
    </div>
  </footer>
);
