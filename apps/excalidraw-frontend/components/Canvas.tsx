"use client"
import { initDraw } from "@/draw";
import { Socket } from "dgram";
import { useEffect, useRef } from "react";


export function Canvas({roomId, socket}: {roomId:string, socket:WebSocket}, ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        if (!canvasRef.current) {
            return
        }
        
        initDraw(canvasRef.current, roomId, socket)
    }, [canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1080} height={1080} ></canvas>
    </div>
}