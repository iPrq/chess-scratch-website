export const Navbar = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <nav className="sticky top-0 z-50 w-full bg-chess-bg/80 backdrop-blur-md shadow-sm">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div 
        className="text-2xl font-extrabold tracking-tighter text-chess-dark cursor-pointer"
        onClick={() => onNavigate('landing')}
      >
        CHECKMATE
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a href="/selection" className="text-sm font-semibold text-chess-dark border-b-2 border-chess-dark pb-1">Play</a>
        <a href="#" className="text-sm font-semibold text-slate-500 hover:text-chess-dark transition-colors">Learn</a>
        <a href="#" className="text-sm font-semibold text-slate-500 hover:text-chess-dark transition-colors">Analysis</a>
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-sm font-semibold text-slate-600 hover:text-chess-dark transition-colors">Log In</button>
        <button className="bg-signature-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-chess-green/20 hover:scale-105 transition-transform">Sign Up</button>
      </div>
    </div>
  </nav>
);
