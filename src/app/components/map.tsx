'use client'

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   window.kakao.maps.load(() => {
  //     var options = {
  //       center: new window.kakao.maps.LatLng(33.450701, 126.570667),
  //       level: 3,
  //     }
  //     const map = new window.kakao.maps.Map(mapRef, options);
  //     console.log(map)
  //   })
  // }, [])
  useEffect(() => {
    const kakaoMapScript = document.createElement('script')
    kakaoMapScript.async = false
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=93d62424841520ad98cbe8b363c63bb0&autoload=false`
    document.head.appendChild(kakaoMapScript)
  
    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        var container = document.getElementById('map')
        var options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        }
  
        var map = new window.kakao.maps.Map(container, options)
      })
    }
  
    kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
  }, [])

  return(
    <>
    <div className="w-[400px] h-[400px]" ref={mapRef} id="map"></div>
    </>
  )
}