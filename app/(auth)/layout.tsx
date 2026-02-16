import React from 'react'

const AuthLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='bg-indigo-500 min-h-screen flex items-center justify-center'>
      {children}
    </div>
  )
}

export default AuthLayout;
