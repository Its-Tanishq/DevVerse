import React from "react";
import { NavLink } from "react-router";
import { MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="w-[90vw] max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <NavLink to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-[#7c3aed] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg">
                D
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                DevVerse
              </span>
            </NavLink>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-50">
              The all-in-one platform for ambitious developers.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Discord"
                className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/problems"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Problems
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contests"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Contests
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/battles"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Battles
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/learn"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Learn
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ai-tools"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  AI Tools
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/discussions"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Discussions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rooms"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Rooms
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rankings"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Rankings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/events"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Blog
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/about"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/careers"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Careers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/press"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Press
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacy"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Privacy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terms"
                  className="nav-link text-muted-foreground text-sm hover:text-foreground"
                >
                  Terms
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © 2025 DevVerse, Inc. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Made for developers, by devverse.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
