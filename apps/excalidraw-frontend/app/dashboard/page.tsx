"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/signin");
    }

    setLoading(false)

    async function fetchRooms() {
      try {
        const res = await axios.get(`${BACKEND_URL}/rooms`);
        setRooms(res.data.rooms);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    }

    fetchRooms();

  }, [router]);

  async function createRoom() {
    if (!roomName) {
      return;
    }
    try {
      const token = localStorage.getItem('token')
      
      await axios.post(`${BACKEND_URL}/room`,
        { room: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRoomName("")
      const res = await axios.get(`${BACKEND_URL}/rooms`);
      setRooms(res.data.rooms)

    } catch (err: any) {
      console.error(err?.response?.data?.message || "Create Failed")
    }

  }

  async function joinRoom(slug: string) {
    try {
      const res = await axios.get(`${BACKEND_URL}/room/${slug}`);
      const roomId = res.data.roomId

      router.push(`/canvas/${roomId}`)
    } catch (err) {
      console.error("Failed to join room")
    }
  }

  if (loading) return <div>Checking auth...</div>;

  return (
    <div>
      {/* Create Room */}
      <div>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
        />
        <button onClick={createRoom}>
          Create Room
        </button>
      </div>

      {/* Room List */}
      <div>
        {rooms.length === 0 && <p>No rooms yet </p>}
        {rooms.map((room) => (
          <div key={room.id}>
            <span>{room.slug}</span>
            <button onClick={() => joinRoom(room.slug)}>
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}