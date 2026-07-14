import type { CSSProperties } from 'react'

/** monochrome SVG (bootstrap-icons, MIT) tinted via CSS mask, same technique as LaptopScreen.tsx */
export function Icon({ icon, size = 18 }: { icon: string; size?: number }) {
  const url = `url(${import.meta.env.BASE_URL}icons/${icon}.svg)`
  const style: CSSProperties = {
    width: size,
    height: size,
    backgroundColor: 'currentColor',
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  }
  return <span style={style} className="inline-block" />
}
