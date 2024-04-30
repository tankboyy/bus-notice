import {xml2json}from 'xml-js';
import Bus from './components/bus';

async function test(id?: string) {
  return fetch('http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList?serviceKey=2ne%2FPTKvr%2BUL%2FsvEmupc%2B8Hs2tFqlSMFO5TxaKhD3Mq5%2FfwEqecNwnUZ8mDR1U0jvCSy96XEAyiPTYR111Sh1Q%3D%3D&stationId=200000078')
  .then(async (res) => {
    const data = xml2json(await res.text(), {compact: true, spaces: 4});
    return data;
  })
  
}

export default async function Home() {
  const data = await test();
  return (
    <>
      <h1>Next.js</h1>
      <Bus data={data}/>
    </>
  );
}
