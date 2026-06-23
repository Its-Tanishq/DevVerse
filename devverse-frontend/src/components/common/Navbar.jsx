import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, User, Settings, LogOut, Search, Bell } from "lucide-react";
import useAuth from "@/store/AuthStore";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toogleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isLoggedIn = useAuth((state) => state.authStatus);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding,backdrop-filter,box-shadow] duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-2"
          : "bg-background border-b border-border py-4"
      }`}
    >
      <div className="flex justify-between h-10 items-center w-[90vw] max-w-7xl mx-auto">
        <NavLink
          to="/"
          onClick={closeMobileMenu}
          className="font-bold text-2xl tracking-tight text-foreground flex items-center"
        >
          <div className="bg-[#7c3aed] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg mr-2">
            D
          </div>
          Dev<span className="text-[#7c3aed]">Verse</span>
        </NavLink>

        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          {isLoggedIn && (
            <NavLink to="/dashboard" className="nav-link hover:text-foreground">
              Dashboard
            </NavLink>
          )}
          <NavLink to="/problems" className="nav-link hover:text-foreground">
            Problems
          </NavLink>
          <NavLink to="/contests" className="nav-link hover:text-foreground">
            Contests
          </NavLink>
          <NavLink to="/learn" className="nav-link hover:text-foreground">
            Learn
          </NavLink>
          <NavLink to="/community" className="nav-link hover:text-foreground">
            Community
          </NavLink>
          <NavLink to="/rankings" className="nav-link hover:text-foreground">
            Rankings
          </NavLink>
        </div>

        <div className="hidden md:flex gap-3 items-center">
          {isLoggedIn ? (
            <>
              <div className="hidden lg:flex items-center bg-accent/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border mr-2 transition-colors hover:bg-accent focus-within:bg-background focus-within:border-[#7c3aed]">
                <Search size={16} className="mr-2" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="bg-transparent border-none outline-none text-[14px] w-48 text-foreground placeholder:text-muted-foreground"
                />
                <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded ml-2 border border-border">
                  ⌘K
                </span>
              </div>

              <button className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground relative flex items-center justify-center mr-1">
                <Bell size={20} />
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
              </button>

              <div className="relative group">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-border hover:bg-accent transition-colors text-foreground"
                  aria-label="Profile"
                >
                  <div className="bg-accent text-foreground w-7 h-7 rounded-full flex items-center justify-center overflow-hidden">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-medium hidden lg:block">
                    Profile
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground hidden lg:block"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </NavLink>

                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-background border border-border shadow-lg rounded-xl overflow-hidden w-48 flex flex-col">
                    {/* <NavLink
                      to="/profile/settings"
                      className="px-4 py-3 text-[14px] font-medium text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Settings
                    </NavLink> */}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 text-[14px] font-medium text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 w-full text-left border-t border-border"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className="bg-accent hover:bg-accent/80 rounded-lg px-4 py-2 font-medium text-foreground transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg px-4 py-2 font-medium text-white transition-colors"
              >
                Get Started
              </NavLink>
            </>
          )}
          <button
            onClick={toogleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          {isLoggedIn && (
            <button className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground relative flex items-center justify-center">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
          )}
          <button
            onClick={toogleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-4 flex flex-col gap-4">
          {isLoggedIn && (
            <NavLink
              to="/dashboard"
              onClick={closeMobileMenu}
              className="font-medium text-foreground py-2 border-b border-border"
            >
              Dashboard
            </NavLink>
          )}
          <NavLink
            to="/problems"
            onClick={closeMobileMenu}
            className="font-medium text-foreground py-2 border-b border-border"
          >
            Problems
          </NavLink>
          <NavLink
            to="/contests"
            onClick={closeMobileMenu}
            className="font-medium text-foreground py-2 border-b border-border"
          >
            Contests
          </NavLink>
          <NavLink
            to="/learn"
            onClick={closeMobileMenu}
            className="font-medium text-foreground py-2 border-b border-border"
          >
            Learn
          </NavLink>
          <NavLink
            to="/community"
            onClick={closeMobileMenu}
            className="font-medium text-foreground py-2 border-b border-border"
          >
            Community
          </NavLink>
          <NavLink
            to="/rankings"
            onClick={closeMobileMenu}
            className="font-medium text-foreground py-2 border-b border-border"
          >
            Rankings
          </NavLink>
          <div className="flex flex-col gap-3 mt-4">
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 rounded-lg px-4 py-3 font-medium text-foreground transition-colors text-center"
                >
                  <User size={20} />
                  Profile
                </NavLink>
                {/* <NavLink
                  to="/profile/settings"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 hover:bg-accent/80 rounded-lg px-4 py-3 font-medium text-foreground transition-colors text-center border border-border"
                >
                  <Settings size={20} />
                  Settings
                </NavLink> */}
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg px-4 py-3 font-medium transition-colors text-center"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/signin"
                  onClick={closeMobileMenu}
                  className="bg-accent hover:bg-accent/80 rounded-lg px-4 py-3 font-medium text-foreground transition-colors text-center"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg px-4 py-3 font-medium text-white transition-colors text-center"
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
