import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Menu,
  User,
  Briefcase,
  Search,
  LogIn,
  X,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

type NavbarProps = {
  onLogin?: () => void;
};

// Define proper types for our navigation links
type NavLink = {
  name: string;
  path: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onLogin = () => {} }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  
  const isLoggedIn = !!user;

  const navLinks: NavLink[] = [
    { name: 'Find Jobs', path: '/jobs', icon: <Search className="h-5 w-5" /> },
    { name: 'Companies', path: '/companies', icon: <Briefcase className="h-5 w-5" /> },
  ];

  const authLinks: NavLink[] = isLoggedIn
    ? [
        { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5" /> },
      ]
    : [
        { name: 'Login', path: '#', icon: <LogIn className="h-5 w-5" />, onClick: onLogin },
      ];

  const allLinks = [...navLinks, ...authLinks];

  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-riser-purple"
            >
              <path
                d="M14 7L18 11L14 15M8 7L4 11L8 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="gradient-text">RiserJobs</span>
          </Link>
        </div>

        {!isMobile && (
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-riser-purple transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center">
          {!isMobile ? (
            <>
              {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={onLogin} disabled={isLoading}>
                    Log In
                  </Button>
                  <Button 
                    className="bg-riser-purple hover:bg-riser-secondary-purple"
                    onClick={onLogin}
                    disabled={isLoading}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-riser-purple transition-colors">
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} disabled={isLoading}>
                    Log Out
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl" onClick={closeMobileMenu}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-riser-purple"
                      >
                        <path
                          d="M14 7L18 11L14 15M8 7L4 11L8 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="gradient-text">RiserJobs</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {allLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="flex items-center gap-3 p-2 text-base font-medium text-gray-700 hover:text-riser-purple hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => {
                          closeMobileMenu();
                          // Safely check if onClick exists before calling it
                          if (link.onClick) {
                            link.onClick();
                          }
                        }}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    ))}
                    {isLoggedIn && (
                      <Button 
                        variant="outline" 
                        onClick={() => { 
                          closeMobileMenu();
                          handleLogout(); 
                        }}
                        disabled={isLoading}
                      >
                        Log Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
