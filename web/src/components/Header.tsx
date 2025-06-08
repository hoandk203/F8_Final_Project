'use client';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 w-full z-50 h-fit bg-[#feead0] py-2 px-4 sm:px-8 lg:px-20 xl:px-32 flex items-center justify-center">
      <div className="w-full max-w-7xl flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <img alt="image_logo" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[77px] lg:h-16 object-cover" src="/logo.png" />
          <p className="text-lg sm:text-xl font-bold not-italic !leading-8 tracking-[-0.5px] font-lato text-neutral-1">Scraplan</p>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row">
          {/* <a className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors" href="/">
            <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Home</p>
          </a> */}
          {/* <a className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors" href="/rates">
            <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Scrap Rates</p>
          </a>
          <a className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors" href="/blogs">
            <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Blogs</p>
          </a>
          <a className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors" href="/career">
            <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Career</p>
          </a> */}
          <a href="/store-register" className="cursor-pointer px-4 py-3 gap-2 justify-center items-center flex flex-row rounded-[8px] bg-[#f9762a] hover:bg-[#e6691f] transition-colors">
            <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-white">Register your store</p>
            <ChevronRightIcon className="text-white w-5 h-5" />              
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#feead0] border-t border-white/20 shadow-lg">
          <div className="flex flex-col px-4 py-4 space-y-2">
            <a 
              className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors block"
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Home</p>
            </a>
            {/* <a 
              className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors block"
              href="/rates"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Scrap Rates</p>
            </a>
            <a 
              className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors block"
              href="/blogs"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Blogs</p>
            </a>
            <a 
              className="py-3 px-4 hover:bg-white/20 rounded-lg transition-colors block"
              href="/career"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-neutral-1">Career</p>
            </a> */}
            <a 
              className="mt-2 px-4 py-3 gap-2 justify-center items-center flex flex-row rounded-[8px] bg-[#f9762a] hover:bg-[#e6691f] transition-colors w-full"
              href="/store-register"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-white">Register your store</p>
              <ChevronRightIcon className="text-white w-5 h-5" />              
            </a>
          </div>
        </div>
      )}
    </header>
  );
} 