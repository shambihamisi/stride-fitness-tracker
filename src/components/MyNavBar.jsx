import React from 'react'
import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const MyNavBar = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-30 transition-colors duration-500 ${
        isScrolled ? "bg-[#1c1c1c]/95 shadow-md" : "bg-transparent"
      }`}>
      <div className="w-full mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex justify-between items-center">
          <img
            src="/Stride logo-01.png"
            alt="Stride Logo"
            className="h-50 w-full"
          />
        </Link>

        <div className="flex items-center gap-6">
          {/* Nav Links */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-[var(--color-on-primary)]">
            <li className="hover:text-secondary transition">Home</li>
            <li className="hover:text-secondary transition">About</li>
            <li className="hover:text-secondary transition">Contact</li>
            <Link
              className="btn btn-primary hover:bg-secondary"
              onClick={() => (window.location.href = "/signin")}
            >
              Sign In
            </Link>
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center gap-6 py-6 bg-primary text-[var(--color-on-primary)] font-medium w-40 absolute right-4 rounded-2xl shadow-lg mb-0">
          <li onClick={() => setMenuOpen(false)} className="hover:text-secondary">Home</li>
          <li onClick={() => setMenuOpen(false)} className="hover:text-secondary">About</li>
          <li onClick={() => setMenuOpen(false)} className="hover:text-secondary">Contact</li>
          <Link
            to="/auth/sign-up"
            onClick={() => setMenuOpen(false)}
            className="btn btn-secondary"
          >
            Join Us
          </Link>
        </ul>
      )}
    </nav>
  );
}

export default MyNavBar