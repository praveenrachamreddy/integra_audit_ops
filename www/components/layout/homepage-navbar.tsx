'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Home,
  Building2,
  Shield,
  MessageSquare,
  LayoutDashboard,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth-store';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navigationLinks = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

const dashboardLinks = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/audit', label: 'Audits', icon: Shield },
  { href: '/dashboard/assistant', label: 'AI Assistant', icon: MessageSquare },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
];

export default function HomepageNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return 'U';
    const first = firstName?.[0] ?? '';
    const last = lastName?.[0] ?? '';
    return (first + last).toUpperCase();
  };

  const getDisplayName = (firstName?: string, lastName?: string): string => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return firstName ?? lastName ?? 'User';
  };

  const isDashboardRoute = pathname?.startsWith('/dashboard');

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">RegOps</span>
            </Link>
          </div>

          {/* Desktop and Tablet Navigation */}
          <div className="hidden md:flex items-center">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1 lg:space-x-6  mr-4">
              {isDashboardRoute ? (
                // Dashboard navigation - more compact on tablet
                <div className="flex items-center space-x-1 lg:space-x-6">
                  {dashboardLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-sm ${
                          isActive 
                            ? 'text-primary font-medium bg-primary/5' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        } transition-colors duration-200`}
                      >
                        <link.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="hidden xl:inline">{link.label}</span>
                        {/* Tooltip for tablet view */}
                        <span className="lg:hidden absolute z-50 px-2 py-1 text-xs bg-popover text-popover-foreground rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transform -translate-y-full -translate-x-1/2 left-1/2 transition-opacity duration-200">
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                // Regular navigation
                navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-sm ${
                      pathname === link.href 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    } transition-colors duration-200`}
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </div>

            {/* Auth Section - Adjusted for tablet */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Dashboard/Home Link */}
                {isDashboardRoute ? (
                  <Button asChild variant="outline" size="sm" className="hidden lg:flex">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span className="hidden lg:inline">Home</span>
                    </Link>
                  </Button>
                  // <></>
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden lg:inline">Dashboard</span>
                    </Link>
                  </Button>
                )}

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications - show only on dashboard */}
                {isDashboardRoute && (
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </Button>
                )}

                {/* User Menu - Compact on tablet */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getDisplayName(user.first_name, user.last_name)}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center space-x-2 pt-1">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-muted-foreground">Online</span>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isDashboardRoute && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="w-full">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <ThemeToggle />
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/login?tab=register">
                    <span className="hidden lg:inline">Get Started</span>
                    <span className="lg:hidden">Sign Up</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {isDashboardRoute ? (
                // Dashboard Navigation
                <>
                  {dashboardLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  <div className="my-2 border-t border-border" />
                  <Link
                    href="/"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Home className="h-4 w-4" />
                    <span>Back to Home</span>
                  </Link>
                </>
              ) : (
                // Regular Navigation
                <>
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 rounded-md text-sm ${
                        pathname === link.href
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </>
              )}
              
              {isAuthenticated ? (
                <>
                  <div className="my-2 border-t border-border" />
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="my-2 border-t border-border" />
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?tab=register"
                    className="block px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 