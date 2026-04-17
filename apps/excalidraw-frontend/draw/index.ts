import { BACKEND_URL } from "@/config"
import axios from "axios"

type Shape = {
    type: "rect",
    x: number
    y: number
    width: number
    height: number
} | {
    type: "circle",
    centerX: number
    centerY: number
    radius: number
}

const clientId = Math.random().toString()

export function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d")


    let existingShapes: Shape[] = []


    if (!ctx) {
        return
    }

    let clicked = false
    let startX = 0
    let startY = 0

    const getCanvasCoords = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    const redraw = () => {
        clearCanvas(canvas, existingShapes, ctx)
    }

    let isAlive = true;

    getExistingShapes(roomId).then((shapes) => {
        if (!isAlive) return;
        existingShapes = shapes
        redraw();
    })

    // Improved the way of handling messages because onmessage not support cleanup but addEventlistner supports cleanup

    // Receive the messages from server that something coming, if that was shape
    const handleSocketMessage = (event: MessageEvent) => {
        const res = JSON.parse(event.data)

        if (res.type === "chat") {

            // Self drawn shape will be ignored
            if (res.clientId === clientId) return;

            const parshedShape = JSON.parse(res.message)
            existingShapes.push(parshedShape)
            console.log("After WS receive:", existingShapes.length)
            redraw();

        }
    }

    socket.addEventListener("message", handleSocketMessage)

    redraw();

    const handleMouseDown = (e: MouseEvent) => {
        clicked = true
        const pos = getCanvasCoords(e)
        startX = pos.x
        startY = pos.y
    }

    const hanleMouseMove = (e: MouseEvent) => {
        if (!clicked) return

        const pos = getCanvasCoords(e)
        const width = pos.x - startX
        const height = pos.y - startY

        clearCanvas(canvas, existingShapes, ctx)
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.strokeRect(startX, startY, width, height)
    }

    // Draws the Shape locally and send that shape to the server for other users
    const handleMouseUp = (e: MouseEvent) => {
        if (!clicked) return;
        clicked = false

        const pos = getCanvasCoords(e)
        const width = pos.x - startX
        const height = pos.y - startY

        const shape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        }

        existingShapes.push(shape)
        
        redraw();

        socket.send(
            JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId,
                clientId
            }),

        )
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", hanleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)

    console.log("Shapes count:", existingShapes.length)

    return () => {
        isAlive = false;

        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mousemove", hanleMouseMove)
        canvas.removeEventListener("mouseup", handleMouseUp)

        socket.removeEventListener("message", handleSocketMessage)
    }


}

function clearCanvas(
    canvas: HTMLCanvasElement,
    existingShapes: Shape[],
    ctx: CanvasRenderingContext2D
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2

    existingShapes.forEach((shape) => {
        if (shape.type === "rect") {
            ctx.fillStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }

    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    const messages = res.data.messages

    const shapes = messages.map((x: { message: string }) => {
        try {
            const messageData = JSON.parse(x.message)
            return messageData;
        }
        catch {
            return null
        }
    })
        .filter(Boolean)
    return shapes
}

// async function getExistingShapes(roomId: string) {
//   const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)

//   const messages = res.data?.messages ?? []

//   const shapes = messages
//     .map((x: { message: string }) => {
//       try {
//         const parsed = JSON.parse(x.message)
//         if (!parsed?.type) return null
//         return parsed
//       } catch {
//         return null
//       }
//     })
//     .filter(Boolean)

//   return shapes
// }
