import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { store } from '../store';
import { Provider } from 'react-redux';
import Header from '../config';
import Layout from '../components/dom/Layout';
import '../styles/index.css';

const Scene = dynamic(() => import('../components/canvas/Scene'), { ssr: true });

export default function App({ Component, pageProps = { title: 'index' } }) {
  const ref = useRef();
  return (
    <Provider store={store}>
      <Header title={pageProps.title} />
      <Layout ref={ref}>
        <Component {...pageProps} />
        {/* The canvas can either be in front of the dom or behind. If it is in front it can overlay contents.
         * Setting the event source to a shared parent allows both the dom and the canvas to receive events.
         * Since the event source is now shared, the canvas would block events, we prevent that with pointerEvents: none. */}
        {Component?.canvas && (
          <Scene className='pointer-events-none' eventSource={ref} eventPrefix='client'>
            {Component.canvas(pageProps)}
          </Scene>
        )}
      </Layout>
      <div id="mobileInterface" className={"noSelect"}>
        <div id="joystickWrapper1"></div>
        <div id="joystickWrapper2"></div>
      </div>
    </Provider>
  );
}
