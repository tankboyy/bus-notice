'use client'

import { createContext, useEffect, useRef, useState } from "react"
import { xml2json } from "xml-js";

declare global {
  interface Window {
    kakao: any;
  }
}



const getBusStopData = async (stationId: string) => {
    return await fetch(`http://apis.data.go.kr/6410000/busstationservice/getBusStationViaRouteList?serviceKey=2ne%2FPTKvr%2BUL%2FsvEmupc%2B8Hs2tFqlSMFO5TxaKhD3Mq5%2FfwEqecNwnUZ8mDR1U0jvCSy96XEAyiPTYR111Sh1Q%3D%3D&stationId=${stationId}`)
    .then(async (res) => {
      return JSON.parse(xml2json(await res.text(), {compact: true, spaces: 4})).response.msgBody.busRouteList
    })
}


export default function Map() {
  const [position, setPosition]= useState<{
    lat: number,
    lng: number
  }>()

  const [busData, setBusData] = useState<any>(null)
  const [busStopData, setBusStopData] = useState<any>(null)

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
        const location = map.getCenter()
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
        console.log(data.busStationAroundList)
        data.busStationAroundList.map((bus: any) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(bus.y._text, bus.x._text),
            map: map,
            text: bus.stationName._text
          })
          marker.setMap(map)
        })
        setBusData(data.busStationAroundList)

      }}>
        불러오기
      </button>
      
      </div>
      {busData && busData.map((bus: any) => {
        return (
        <div key={bus.stationId._text}>
        <h1 className=" cursor-pointer"
        onClick={async () => {
          console.log(bus)
          // 도착 예정 버스 정보
          const data = await fetch(`http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList?serviceKey=2ne%2FPTKvr%2BUL%2FsvEmupc%2B8Hs2tFqlSMFO5TxaKhD3Mq5%2FfwEqecNwnUZ8mDR1U0jvCSy96XEAyiPTYR111Sh1Q%3D%3D&stationId=${bus.stationId._text}`)
            .then(async (res) => {
              return JSON.parse(xml2json(await res.text(), {compact: true, spaces: 4}))
            })
            console.log(data)

            // 이거다 ^^!@##$!@#
          // const data3 = await fetch(`http://apis.data.go.kr/6410000/busstationservice/getBusStationViaRouteList?serviceKey=2ne%2FPTKvr%2BUL%2FsvEmupc%2B8Hs2tFqlSMFO5TxaKhD3Mq5%2FfwEqecNwnUZ8mDR1U0jvCSy96XEAyiPTYR111Sh1Q%3D%3D&stationId=${bus.stationId._text}`)
          //   .then(async (res) => {
          //     return JSON.parse(xml2json(await res.text(), {compact: true, spaces: 4}))
          //   })
          //   console.log(data3)

          // const data2 = await fetch(`http://apis.data.go.kr/6410000/buslocationservice/getBusLocationList?serviceKey=2ne%2FPTKvr%2BUL%2FsvEmupc%2B8Hs2tFqlSMFO5TxaKhD3Mq5%2FfwEqecNwnUZ8mDR1U0jvCSy96XEAyiPTYR111Sh1Q%3D%3D&routeId=223000100`)
          //   .then(async (res) => {
          //     return JSON.parse(xml2json(await res.text(), {compact: true, spaces: 4}))
          //   })
          //   console.log(data2)

          // 경유경류소목록조회 버스번호(routeId)로 경유경류소 목록 조회
          // const data = await fetch(`http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList?serviceKey=2ne%2FPTKvr%2BUL%2FsvEmupc%2B8Hs2tFqlSMFO5TxaKhD3Mq5%2FfwEqecNwnUZ8mDR1U0jvCSy96XEAyiPTYR111Sh1Q%3D%3D&stationId=${bus.stationId._text}`)
          //   .then(async (res) => {
          //     return JSON.parse(xml2json(await res.text(), {compact: true, spaces: 4}))
          //   })
          //   console.log(data)

          const busStopData = await getBusStopData(bus.stationId._text)
          console.log(busStopData)
          setBusStopData({data: busStopData, stationName: bus.stationName._text})

        }}
        >
        {bus.stationName._text}
        </h1>
        </div>
        )
      })}
      </div>
      <div>
        {
          busStopData && 
          <div>
            <h1>
              {busStopData.stationName}
            </h1>
          {busStopData && busStopData.data.map((bus: any) => {
            return (
            <div key={bus.routeId._text}>
            <h1>
            {bus.routeName._text}
            </h1>
            </div>
            )
          })}
          </div>
        }
      </div>
    </div>
    </>
  )
}