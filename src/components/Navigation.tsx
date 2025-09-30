'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/kanban', label: 'Kanban', icon: '📋' },
    { href: '/tasks', label: 'Tasks', icon: '📝' },
    { href: '/tasks/create', label: 'Create', icon: '➕' },
    { href: '/users', label: 'Users', icon: '👥' }
  ];
  
  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-14 md:h-16">
          <h1 className="text-lg md:text-xl font-bold">Task Manager</h1>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-2 lg:space-x-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500'
                }`}
              >
                <span className="hidden lg:inline">{link.label}</span>
                <span className="lg:hidden">{link.icon}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
