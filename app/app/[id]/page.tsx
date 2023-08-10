import dynamic from 'next/dynamic';
import React from 'react';
import Canvas from '../(canvas)/Canvas';

export default function Page({ params }: { params: { id: string } }) {
  return <div>My Post: {params.id}</div>
}

Page.canvas = (props) => <Canvas />

export async function getStaticProps() {
  return { props: { id: 'FPS Portfolio' } }
}

