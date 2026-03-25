export const Navbar = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <nav className="sticky top-0 z-50 w-full bg-chess-bg/80 backdrop-blur-md shadow-sm">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div 
        className="text-2xl font-extrabold tracking-tighter text-chess-dark cursor-pointer flex items-center gap-2"
        onClick={() => onNavigate('landing')}
      >
        <img src="/pieces/bP.svg" alt="Logo" className="w-8 h-8" />
        CHECKMATE
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a href="/selection" className="text-sm font-semibold text-chess-dark border-b-2 border-chess-dark pb-1">Play</a>
        <a href="#" className="text-sm font-semibold text-slate-500 hover:text-chess-dark transition-colors">Learn</a>
      </div>
    </div>
  </nav>
);
