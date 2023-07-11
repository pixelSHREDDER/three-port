import dynamic from 'next/dynamic'
import Modal from '../components/dom/Modal'
import Item from '../components/canvas/Item'
import React from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three-stdlib'

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic(() => import('../components/canvas/Logo'), { ssr: false })

// Dom components go here
export default function Page(props) {}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
//Page.canvas = (props) => <Logo scale={0.5} route='/blob' position-y={-1} />
Page.canvas = (props) =>
  <>
    <Item
      rotation={[0, 0.75, 0]}
      obj={props.arcade}
      color="hotpink"
      position={[-6, 12, 1]}
      route={undefined} />
    <Item
      rotation={[0, 0.15, 0]}
      obj={props.arcade}
      color="green"
      position={[-3, 14, -1.5]}
      route={undefined} />
    <Logo scale={0.25} route='/blob' position-y={1} />
    <Item
      rotation={[0, -0.15, 0]}
      obj={props.arcade}
      color="hotpink"
      position={[3, 14, -1.5]}
      route={undefined} />
    <Item
      rotation={[0, -0.75, 0]}
      obj={props.arcade}
      color="hotpink"
      position={[6, 12, 1]}
      route={undefined} />
  </>

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
