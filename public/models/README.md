# Drop-in 3D models

Put optimized `.glb` props here and render them with `<GltfProp url="models/name.glb" … />`
(see `src/scene/props/GltfProp.tsx`).

Always compress before committing (meshopt + WebP textures):

```
npx @gltf-transform/cli optimize input.glb public/models/name.glb --texture-compress webp
```

Good CC0 sources: kenney.nl (Furniture Kit), quaternius.com, poly.pizza.
Keep the total under ~3 MB so the loading screen stays snappy.
