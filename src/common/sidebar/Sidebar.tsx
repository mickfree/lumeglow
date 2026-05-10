import { Link, useLocation } from "react-router";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const menu = [
    { name: "Home", path: "/", count: 36 },
    { name: "Calendar", path: "/calendar", count: 12 },
    { name: "Movie Map", path: "/map", count: 0 },
  ];

  const NavItem = ({ name, path }: { name: string, path: string, count?: number }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={onClose}
        className={`flex items-center justify-between py-1.5 px-6 text-sm hover:text-white transition-colors ${isActive ? "text-white font-medium bg-zinc-800/50" : "text-zinc-400"
          }`}
      >
        <span>{name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-zinc-950 text-zinc-300 flex flex-col border-r border-zinc-800 font-sans z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0 justify-between">
          <h1 className="text-5xl font-black text-white cursor-pointer"><a href="/">LumeGlow</a></h1>
          <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-grow overflow-y-auto py-4">

          {/* menu Section */}
          <div className="mb-6">
            <h3 className="px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">menu</h3>
            <div className="flex flex-col gap-1">
              {menu.map(link => <NavItem key={link.path} {...link} />)}
            </div>
          </div>

        </nav>
      </aside>
    </>
  );
}
