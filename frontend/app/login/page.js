'use client'
import React from 'react';
import { AuthLogin } from "../_utils/auth-login";

const LogInPage = () => {
  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <AuthLogin />
    </div>
  );
};

export default LogInPage;
