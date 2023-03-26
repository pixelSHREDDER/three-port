import dynamic from 'next/dynamic'
import Instructions from '../components/dom/Instructions'
import Item from '../components/canvas/Item'
import React from 'react'

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic(() => import('../components/canvas/Logo'), { ssr: false })

// Dom components go here
export default function Page(props) {
  return (
    <Instructions>
      This is a minimal starter for Nextjs + React-three-fiber and Threejs. Click on the{' '}
      <span className='text-cyan-200'>atoms nucleus</span> to navigate to the{' '}
      <span className='text-green-200'>/blob</span> page. OrbitControls are enabled by default.
    </Instructions>
  )
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
//Page.canvas = (props) => <Logo scale={0.5} route='/blob' position-y={-1} />
Page.canvas = (props) =>
  <>
    <Item
      rotation-y={-0.15}
      color="hotpink"
      scale={0.5}
      position={[-6, 12, 1]}
      route={undefined} />
    <Item
      rotation-y={-0.75}
      color="hotpink"
      scale={0.5}
      position={[-3, 14, 0.5]}
      route={undefined} />
    <Logo scale={0.25} route='/blob' position-y={1} />
    <Item
      rotation-y={0.75}
      color="hotpink"
      scale={0.5}
      position={[3, 14, 0.5]}
      route={undefined} />
    <Item
      rotation-y={0.15}
      color="hotpink"
      scale={0.5}
      position={[6, 12, 1.25]}
      route={undefined} />
  </>

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
