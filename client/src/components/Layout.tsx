import { Link, useLocation } from "wouter";
import { Utensils, Users, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Canteen", icon: Utensils },
    { href: "/students", label: "Students", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-card border-r border-border/50 shadow-lg z-10 sticky top-0 md:h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-accent rounded-xl shadow-lg shadow-accent/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              SchoolEats
            </h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={clsx("w-5 h-5", isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform")} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-8">
          <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white shadow-xl">
            <p className="text-sm font-medium text-gray-300">Daily Tip</p>
            <p className="text-xs text-gray-400 mt-1">Healthy snacks boost brain power for better grades!</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
