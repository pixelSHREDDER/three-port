import React, { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';

interface Props {
  children?: ReactNode,
}

export type Ref = HTMLElement;

const Layout = forwardRef<Ref, Props>((props, ref) => {
  const localRef = useRef();

  useImperativeHandle(ref, () => localRef.current);

  return (
    <div
      ref={localRef}
      className='absolute top-0 left-0 z-10 h-screen w-screen overflow-hidden bg-zinc-900 text-gray-50'>
      {props.children}
    </div>
  );
})

Layout.displayName = 'Layout';

export default Layout;