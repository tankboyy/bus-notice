'use client'

import { Children, createContext, useContext, useEffect } from "react"

export const MapContext = createContext(null)

export default function Map({children}: {children: React.ReactNode}) {

  let map

  useEffect(() => {
    const kakaoMapScript = document.createElement('script')
    kakaoMapScript.async = false
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=93d62424841520ad98cbe8b363c63bb0&autoload=false`
    document.head.appendChild(kakaoMapScript)
    
    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        var container = document.getElementById('map')
        var options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        }
  
        map = new window.kakao.maps.Map(container, options)
      })
    }
  
    kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
    console.log('hihi')
  }, [])
  return (
    <>
    {map ? 
    <MapContext.Provider value={map}>
      <>
    <div className="w-[400px] h-[400px]" id="map"/>
    {Children}
      </>
    </MapContext.Provider> :
    <div>Loading...</div>
    }
    </>
  )
}