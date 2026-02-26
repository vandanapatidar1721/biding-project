import { Link, useLocation } from "react-router-dom";
import { Gavel, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isAdmin, logout } from "@/lib/auth";

const Navbar = () => {
  const location = useLocation();
  const user = getCurrentUser();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Gavel className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-tight">
              <span className="text-foreground">Regrip</span>
              <span className="text-primary">Bid</span>
            </span>
            <span className="text-[11px] text-muted-foreground">Real-time tyre auctions</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              className="text-xs"
            >
              Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              size="sm"
              className="text-xs"
            >
              Auctions
            </Button>
          </Link>
          {isAdmin() && (
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "default" : "ghost"}
                size="sm"
                className="text-xs"
              >
                Admin
              </Button>
            </Link>
          )}
          {user ? (
            <>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground max-w-[120px] truncate" title={user.email}>
                <User className="h-3.5 w-3.5" />
                {user.email}
              </span>
              <Button size="sm" variant="ghost" className="text-xs gap-1.5" onClick={logout}>
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant={isActive("/login") ? "default" : "ghost"}
                  size="sm"
                  className="text-xs"
                >
                  Login
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="text-xs glow-green">
                  Join Auction
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

