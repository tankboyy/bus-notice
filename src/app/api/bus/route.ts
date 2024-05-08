import { NextResponse } from "next/server";
import {xml2json}from 'xml-js';

export async function POST(request: Request) {
  console.log('Hello from the API')
  const { lat, lng } = await request.json();
  console.log(lat, lng)
  // fetch(`http://openapi.gbis.go.kr/ws/rest/busstationservice/searcharound?serviceKey=${process.env.NEXT_PUBLIC_GGDATA_API_KEY}&x=${lng}&y=${lat}`, {

  // })
  return NextResponse.json(await fetch(`http://openapi.gbis.go.kr/ws/rest/busstationservice/searcharound?serviceKey=1234567890&x=${lng}&y=${lat}`)
  .then(async (res) => {
    const data = JSON.parse(xml2json(await res.text(), {compact: true, spaces: 1}));
    return data.response.msgBody
  }))
}