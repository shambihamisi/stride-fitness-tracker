import React from "react";
import { Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-tertiary text-white py-8 px-6 md:px-20 border-t border-secondary">
      <div className="flex flex-col md:flex-row justify-center items-center md:items-center gap-4 md:gap-8">
        
        {/* Logo */}
        <div className="flex flex-col items-start">
          <img
            src="/Stride logo-01.png"
            alt="Stride Logo"
            className="h-80 w-full"
          />
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4 text-white">
          <h3 className="text-white font-semibold text-lg mb-1">
            <span className="border-b-2 border-primary pb-1">Contact Us</span>
          </h3>
          <p className="text-sm">+254 729 599 659</p>
          <p className="text-sm">00100, Nairobi, Kenya</p>
          <p className="text-sm">shambi.hamisi@gmail.com</p>
        </div>

        {/* Socials */}
        <div className="flex flex-col px-6 gap-4">
          <h3 className="text-white font-semibold text-lg mb-1">
            <span className="border-b-2 border-primary pb-1">Socials</span>
          </h3>

          <div className="flex gap-6">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary text-3xl transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_6px_#b3242b]"
            >
              <Instagram />
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary text-3xl transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_6px_#b3242b]"
            >
              <Twitter />
            </a>

            {/* Gmail */}
            <a
              href="mailto:shambi.hamisi@gmail.com"
              className="text-primary hover:text-primary text-3xl transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_6px_#b3242b]"
            >
              <Mail />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#3a0505] mt-8 pt-4 text-center text-sm text-[#aaa]">
        Copyright © {new Date().getFullYear()} Stride. All rights reserved.
      </div>
    </footer>
  );
}
