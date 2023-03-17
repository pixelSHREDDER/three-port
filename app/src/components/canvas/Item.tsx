import { useState } from 'react'
import { useRouter } from 'next/router'
import { useCursor, MeshDistortMaterial } from '@react-three/drei'
import React from 'react'

export default function Item({ route, ...props }) {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}>
      <boxGeometry args={[6, 6, 6]} />
      <MeshDistortMaterial roughness={0} color={hovered ? 'hotpink' : '#1fb2f5'} />
    </mesh>
  )
}
