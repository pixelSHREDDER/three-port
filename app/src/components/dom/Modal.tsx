import React from "react";

export default function Modal({ children, classNames }) {
  const className = `absolute top-16 left-16 right-16 bottom-16 z-50 m-auto sm:max-w-lg rounded-lg bg-zinc-800 px-5 py-4 sm:px-10 sm:py-8 text-sm shadow-xl md:text-base text-center ${classNames}`;
  return (
    <>
      <div className="h-full w-full fixed opacity-50 z-10 bg-black"></div>
      <div
        className={className}
        /*style={{
          maxWidth: 'calc(100% - 28px)',
          maxHeight: 'calc(100% - 28px)',
          //width: 'calc(100% - 28px)',
        }}*/>
        {children}
      </div>
    </>
  )
}
