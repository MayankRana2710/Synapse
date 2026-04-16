import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Removed the indigo background, added full width, and kept it perfectly centered
    <div className="relative flex h-full min-h-screen w-full items-center justify-center">
      {children}
    </div>
  )
}

export default AuthLayout;