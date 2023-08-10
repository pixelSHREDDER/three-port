import dynamic from 'next/dynamic'
import Item from '../components/canvas/Item'
import React from 'react'
import { useLoader } from '@react-three/fiber'
//import { OBJLoader } from 'three-stdlib'
//import Switchboard from '../components/canvas/switchboard/Switchboard'

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic(() => import('../components/canvas/Logo'), { ssr: false })
const Switchboard = dynamic(() => import('../components/canvas/switchboard/Switchboard'), { ssr: false })

// Dom components go here
export default function Page(props) {}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
//Page.canvas = (props) => <Logo scale={0.5} route='/blob' position-y={-1} />
Page.canvas = (props) =>
  <>
    <Item
      rotation={[0, 1.75, 0]}
      color="hotpink"
      position={[-3, 12, -4]}
      route={undefined} />
    <Item
      rotation={[0, 1.75, 0]}
      color="green"
      position={[-3, 14, -8]}
      route={undefined} />
    <Logo scale={0.25} route='/blob' position-y={1} />
    <Item
      rotation={[0, -1.75, 0]}
      color="hotpink"
      position={[3, 14, -8]}
      route={undefined} />
    <Item
      rotation={[0, -1.75, 0]}
      color="hotpink"
      position={[3, 12, -4]}
      route={undefined} />
    <Switchboard
      rotation={[0, -0.5, 0]}
      color="hotpink"
      position={[3, 0, 1.5]}
      route={undefined} />
  </>

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
