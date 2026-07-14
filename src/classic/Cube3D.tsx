export function Cube3D() {
  return (
    <div className="cube3d-scene" aria-hidden="true">
      <div className="cube3d">
        <div className="cube3d-face cube3d-face--front" />
        <div className="cube3d-face cube3d-face--back" />
        <div className="cube3d-face cube3d-face--right" />
        <div className="cube3d-face cube3d-face--left" />
        <div className="cube3d-face cube3d-face--top" />
        <div className="cube3d-face cube3d-face--bottom" />
      </div>
    </div>
  )
}
