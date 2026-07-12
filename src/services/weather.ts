import { useEffect, useState } from 'react'
import { getJSON } from './http'
import config from '../data/config.json'

/**
 * Live Hyderabad weather via Open-Meteo (free, no key). Fetched once per
 * session; drives the balcony rain particles and the balcony room card line.
 */

export interface Weather {
  temp: number
  code: number
  wind: number
  raining: boolean
  label: string
}

interface OpenMeteo {
  current: { temperature_2m: number; weather_code: number; wind_speed_10m: number }
}

/** WMO weather codes → short human label */
function describe(code: number): string {
  if (code === 0) return 'clear skies'
  if (code <= 2) return 'partly cloudy'
  if (code === 3) return 'overcast'
  if (code === 45 || code === 48) return 'foggy'
  if (code <= 57) return 'drizzle'
  if (code <= 67) return 'rain'
  if (code <= 77) return 'snow (?!)'
  if (code <= 82) return 'rain showers'
  if (code >= 95) return 'a thunderstorm'
  return 'strange weather'
}

const isRaining = (code: number) => (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95

let promise: Promise<Weather | null> | null = null

export function getWeather(): Promise<Weather | null> {
  promise ??= getJSON<OpenMeteo>(config.apis.weather).then((d) => {
    if (!d?.current) return null
    const { temperature_2m: temp, weather_code: code, wind_speed_10m: wind } = d.current
    return { temp, code, wind, raining: isRaining(code), label: describe(code) }
  })
  return promise
}

/** null until the (session-cached) fetch resolves; stays null on failure */
export function useWeather(): Weather | null {
  const [w, setW] = useState<Weather | null>(null)
  useEffect(() => {
    let live = true
    void getWeather().then((v) => live && setW(v))
    return () => {
      live = false
    }
  }, [])
  return w
}
