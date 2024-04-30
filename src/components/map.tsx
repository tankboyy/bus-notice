'use client'

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const [position, setPosition]= useState<{
    lat: number,
    lng: number
  }>()

  const [busData, setBusData] = useState<any>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude)
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      })
      fetch("/api/bus", {
        method: "POST",
        body: JSON.stringify({
          lat: position?.lat,
          lng: position?.lng
        })
      }).then(async res => {
        const {busStationAroundList} = await res.json()
        setBusData(busStationAroundList)
      })
    }
  }, [])
  let map:any = undefined;
  useEffect(() => {

    if(!position) return
    const kakaoMapScript = document.createElement('script')
    kakaoMapScript.async = false
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=93d62424841520ad98cbe8b363c63bb0&autoload=false`
    document.head.appendChild(kakaoMapScript)
    
    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        var container = document.getElementById('map')
        var options = {
          center: new window.kakao.maps.LatLng(position.lat, position.lng),
          level: 3,
        }
  
        map = new window.kakao.maps.Map(container, options)
      })
    }
  
    kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
  }, [position])

  return(
    <>
    <button onClick={async () => {
      if(!map) return
      const location = map.getCenter()
      console.log( location.Ma, location.La)

    
    }}>asd</button>
    <div className="w-[400px] h-[400px]" id="map" ref={mapRef}></div>
    <div>
      <h1>List</h1>
      {busData && busData.map((bus: any) => {
        return (
        <div key={bus.stationId._text}>
        <h1>
        {bus.stationName._text}
          </h1>
        </div>
        )
      })}
    </div>
    </>
  )
}