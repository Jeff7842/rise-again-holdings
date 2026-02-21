"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "#services" },
  { name: "Available Listings", href: "/listings" },
  { name: "Blog", href: "#blog" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter()

  function handleClick() {
    router.push('/contact');
  }

  return (
    <nav
      className={`absolute w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between px-6 py-4 transition-all duration-300 rounded-2xl ${
            isScrolled
              ? "bg-white/70 backdrop-blur-md shadow-xl"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-14 md:w-18 h-full bg-rise-red rounded-full flex items-center justify-center">
              <Image
                src="https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/Asset%207@2x.webp"
                alt=""
                width={150}
                height={150}
              />
            </div>
            <div className="">
              <h1 className="text-[12px] md:text-[14px] font-bold  text-gray-900">
                RISE AGAIN HOLDINGS LTD
              </h1>
              <p className="text-[8px] md:text-xs text-gray-600">REAL ASSEST, REAL VALUE</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium hover:text-red-700 focus:text-red-800 transition-colors ${
                  isScrolled
                    ? "text-gray-900 hover:text-rise-red"
                    : "text-gray-900 hover:text-rise-red"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <button
          onClick={handleClick}
            className={`border px-6 py-2.5 hidden lg:block font-medium transition-colors${
              isScrolled
                ? "bg-transparent text-gray-900 border-gray-900 hover:bg-red-700 hover:text-white hover:border-red-700 focus:bg-red-800 focus:text-white focus:border-red-800"
                : "bg-transparent text-gray-900 border-gray-900 hover:bg-red-700 hover:text-gray-50 hover:border-red-700 focus:bg-red-800 focus:text-gray-50 focus:border-red-800"
            }`}
          >
            Contact Us
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-900 active:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} className="text-red-600"/> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full w-[90%] justify-center rounded-2xl bg-white/75 backdrop-blur-lg border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-900 hover:text-rise-red font-medium py-2  hover:text-red-600 focus:text-red-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <button className="bg-red-700 text-white px-6 py-3 font-medium hover:bg-red-700 focus:bg-red-800 focus:text-white focus:border-red-800 focus:scale-[0.98] transition-colors mt-4">
                  Contact Us Today
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
