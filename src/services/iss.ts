import { twoline2satrec, propagate, gstime, eciToGeodetic, degreesLat, degreesLong, type SatRec } from 'satellite.js'
import { getJSON } from './http'
import config from '../data/config.json'

/**
 * ISS position computed CLIENT-SIDE. Position APIs (wheretheiss.at,
 * open-notify) proved unreachable from some ISP routes, so instead we fetch
 * the station's TLE orbital elements once per session (tle.ivanstanojevic.me,
 * free + CORS) and propagate with SGP4 via satellite.js — which also means
 * the readout can tick live with zero further requests.
 */

export interface ISS {
  lat: number
  lon: number
  altitudeKm: number
  velocityKmh: number
  /** great-circle distance from the balcony (Hyderabad) */
  distanceKm: number
  /** compass bearing from Hyderabad towards the ISS ground point */
  bearing: string
}

interface TleResponse {
  name: string
  line1: string
  line2: string
}

const HYD = { lat: 17.385, lon: 78.4867 }
const R = 6371
const rad = (d: number) => (d * Math.PI) / 180

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = rad(lat2 - lat1)
  const dLon = rad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function compassBearing(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const y = Math.sin(rad(lon2 - lon1)) * Math.cos(rad(lat2))
  const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) - Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1))
  const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

let satrecPromise: Promise<SatRec | null> | null = null

function getSatrec(): Promise<SatRec | null> {
  satrecPromise ??= getJSON<TleResponse>(config.apis.issTle).then((tle) => {
    if (!tle?.line1 || !tle.line2) return null
    try {
      return twoline2satrec(tle.line1, tle.line2)
    } catch {
      return null
    }
  })
  return satrecPromise
}

/** propagate the cached orbit to `when` — pure math once the TLE is loaded */
function positionAt(satrec: SatRec, when: Date): ISS | null {
  try {
    const pv = propagate(satrec, when)
    if (!pv || typeof pv.position === 'boolean' || typeof pv.velocity === 'boolean' || !pv.position || !pv.velocity) return null
    const gmst = gstime(when)
    const geo = eciToGeodetic(pv.position, gmst)
    const lat = degreesLat(geo.latitude)
    const lon = degreesLong(geo.longitude)
    const v = pv.velocity
    return {
      lat,
      lon,
      altitudeKm: geo.height,
      velocityKmh: Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 3600,
      distanceKm: haversine(HYD.lat, HYD.lon, lat, lon),
      bearing: compassBearing(HYD.lat, HYD.lon, lat, lon),
    }
  } catch {
    return null
  }
}

/** first call fetches the TLE; afterwards this is instant and offline */
export async function getISS(when = new Date()): Promise<ISS | null> {
  const satrec = await getSatrec()
  if (!satrec) return null
  return positionAt(satrec, when)
}

/** synchronous tick for live displays — null until the TLE has arrived */
let cachedSatrec: SatRec | null = null
export function tickISS(): ISS | null {
  if (!cachedSatrec) {
    void getSatrec().then((s) => (cachedSatrec = s))
    return null
  }
  return positionAt(cachedSatrec, new Date())
}
