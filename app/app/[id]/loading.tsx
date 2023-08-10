//import dynamic from 'next/dynamic';
import React from 'react';

//const Logo = dynamic(() => import('../../components/canvas/Logo'), { ssr: false })

export default function Page({ params }: { params: { id: string } }) {
  return <div>Loading: {params.id}</div>
}

//Page.canvas = (props) => <Logo scale={0.5} route='/blob' position-y={-1} />

export async function getStaticProps() {
  return { props: { id: 'FPS Portfolio' } }
}

