import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * Drop-in loader for real 3D models. Put an optimized .glb into
 * `public/models/` and render:
 *
 *   <GltfProp url="models/sofa.glb" position={[-7.5, 0, 6]} scale={1.2} />
 *
 * Compress models first (meshopt + WebP textures, huge savings):
 *   npx @gltf-transform/cli optimize input.glb public/models/sofa.glb --texture-compress webp
 */
export function GltfProp({
  url,
  ...props
}: { url: string } & Omit<JSX.IntrinsicElements['group'], 'children'>) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + url)
  const clone = useMemo(() => scene.clone(), [scene])
  return (
    <group {...props}>
      <primitive object={clone} />
    </group>
  )
}
