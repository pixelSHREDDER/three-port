import dynamic from 'next/dynamic'
import Modal from '../components/dom/Modal'
import React from 'react'

const Blob = dynamic(() => import('../components/canvas/Blob'), { ssr: false })

export default function Page(props) {
  return (
    <Modal>
      <p>
        This is the <span className='text-green-200'>/blob</span> route. Click on the blob to navigate back. The canvas was
        not unmounted between route changes, only its contents. If you want scene contents to persist, put them into{' '}
        <span className='text-green-200'>@/components/canvas/Scene</span>.
      </p>
    </Modal>
  )
}

Page.canvas = (props) => <Blob route='/' position-y={-0.75} />

export async function getStaticProps() {
  return { props: { title: 'Blob' } }
}
