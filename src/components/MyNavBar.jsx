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
    <nav className={`navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="public\Stride logo-01.png"
            alt="Stride Logo"
            className="h-50 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-[var(--color-on-primary)]">
            <Link to="/" className="hover:text-secondary transition">Home</Link>
            <Link to="/about" className="hover:text-secondary transition">About</Link>
            <Link to="/contact" className="hover:text-secondary transition">Contact</Link>
            <Link
              to="/auth/SignUpPage"
              className="btn btn-primary hover:bg-secondary"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-black focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-6 bg-primary text-[var(--color-on-primary)] font-medium w-40 absolute right-4 rounded-2xl shadow-lg mb-0">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-secondary">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-secondary">About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-secondary">Contact</Link>
          <Link
            to="/auth/sign-up"
            onClick={() => setMenuOpen(false)}
            className="btn btn-secondary"
          >
            Join Us
          </Link>
        </div>
      )}
    </nav>
  );
}

export default MyNavBar