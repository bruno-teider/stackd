"use client";

import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <a href="/home" className="text-black text-4xl  font-bold">
            S.
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-row gap-12 items-center">
          <a
            href="/calculator"
            className="text-gray-700 hover:text-black transition-colors"
          >
            Calculadora
          </a>
          <a
            href="/wallet"
            className="text-gray-700 hover:text-black transition-colors"
          >
            Carteira
          </a>
        </nav>

        {/* Profile Button */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
