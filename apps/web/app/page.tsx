"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {

  const [roomId, serRoomId] = useState("")
  const navigation = useRouter()

  return (
   <div style={{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:"100vh",
    width:"100vw"
   }}>
    <div>
      <input style={{
          padding:10
        }}
        value={roomId} onChange={(e) => {
          serRoomId(e.target.value)
        }} type="text" placeholder="roomId">
      </input>
      
      <button style={{padding:10}} onClick={() => {
        navigation.push(`/room/${roomId}`)
      }}>Join Room
      </button>
    </div> 
   </div>
  );
}
