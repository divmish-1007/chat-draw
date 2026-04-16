"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const inputref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/signin");
      return;
    }

    setLoading(false)

    // Auto focus on input box when loads the page
    

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

    if (!roomName.trim()) {
      setError("Room name cannot be empty");
      inputref.current?.select();
      inputref.current?.focus();
      return;
    }

    setIsCreating(true)
    setError("");

    try {
      const token = localStorage.getItem('token')

      const resp = await axios.post(`${BACKEND_URL}/room`,
        { room: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Auto Join After Creation of the room
      const roomId = resp.data.roomId;
      setRoomName("");
      router.push(`/canvas/${roomId}`);

    } catch (err: any) {
      setError(err?.response?.data?.message || "Create Failed")
      setTimeout(() => {
        inputref.current?.focus();
        inputref.current?.select();
      }, 0)
    } finally {
      setIsCreating(false)
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createRoom();
          }}
        >
          <input
            ref={inputref}
            className="px-3 py-2 border"
            autoFocus
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value)
              setError("")
            }}
            placeholder="Enter room name"
          />

          {/* Possible Errors Visible in UI */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create-Room"}
          </button>
        </form>

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