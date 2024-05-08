'use client'

import { createContext, useEffect, useRef, useState } from "react"
import { xml2json } from "xml-js";

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContext = createContext(null)

export default function Map() {
  const [position, setPosition]= useState<{
    lat: number,
    lng: number
  }>()

  const [busData, setBusData] = useState<any>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      const data = navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude)
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        return "hihi"
      })
      console.log(data)
    }
  }, [])


  useEffect(() => {
    console.log('fetching')
    async function fetchData() {
      console.log('asd')
      if(!map) return
      console.log('fetching data')
      const location = map.getCenter()
      console.log( location.Ma, location.La)
    
      const data = await fetch("/api/bus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: location.Ma,
          lng: location.La
        }),
      })
      console.log(await data.json())
    }

    fetchData()
  }, [position])

  const [map, setMap] = useState<any>(null)


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
  
        setMap(new window.kakao.maps.Map(container, options))
      })
    }
  
    kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
  }, [position])

  useEffect(() => {
    console.log('changed', map)
  }, [map])

  return(
    <>
    <button onClick={() => {
      console.log(map.getCenter())
      const mapTypeControl = new window.kakao.maps.MapTypeControl()

        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)
    }}>
      test
    </button>
    <div className="w-[400px] h-[400px]" id="map"></div>
    
    <div className="flex">
      <div className="flex flex-col w-1/2">
      <div className="flex flex-row justify-between">

      <h1>List</h1>
      <button onClick={async () => {
        console.log("불러오기")
        const location = map.getCenter()
        console.log(location.Ma, location.La)
        const data = await fetch('api/bus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            lat: location.Ma,
            lng: location.La
          })
        })
        .then(async (res) => await res.json())
        setBusData(data.busStationAroundList)
      }}>
        불러오기
      </button>
      </div>
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
    </div>
    </>
  )
}