import React from "react";

export default function Modal({ children }) {
  return (
    <div
      className='absolute top-16 left-1/2 max-w-lg -translate-x-1/2 rounded-lg bg-zinc-800 px-10 py-8 text-sm shadow-xl md:text-base text-center'
      style={{ maxWidth: 'calc(100% - 28px)' }}>
      {children}
    </div>
  )
}
