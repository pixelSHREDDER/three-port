import dynamic from 'next/dynamic'
import Modal from '../components/dom/Modal'
import React from 'react'

const Blob = dynamic(() => import('../components/canvas/Blob'), { ssr: false })

export default function Page(props) {}

Page.canvas = (props) => <Blob route='/' position-y={-0.75} />

export async function getStaticProps() {
  return { props: { title: 'Blob' } }
}
