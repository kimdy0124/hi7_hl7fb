'use client'
import React from 'react';
import Link from 'next/link';

function HomePage() {
  return (
    <div className="relative h-screen bg-gradient-to-r from-blue-300 to-purple-300 flex justify-center items-center">
      <div className="absolute inset-0 opacity-50"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold mb-8">Welcome</h1>
        <div className="flex justify-center space-x-4">
          <div>
            <Link href="/login" className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out">
                Log in
            </Link>
          </div>
          <div>
            <Link href="/signup" className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out">
                Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
