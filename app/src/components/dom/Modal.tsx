import React from "react";

export default function Modal({ children }) {
  return (
    <div
      className='absolute top-16 left-16 right-16 bottom-16 max-w-lg rounded-lg bg-zinc-800 px-10 py-8 text-sm shadow-xl md:text-base text-center flex flex-wrap justify-evenly items-center'
      style={{
        maxWidth: 'calc(100% - 28px)',
        maxHeight: 'calc(100% - 28px)',
        //width: 'calc(100% - 28px)',
      }}>
      {children}
    </div>
  )
}
