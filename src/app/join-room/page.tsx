'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Join a Room</h1>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
        className="border p-2 mb-4 w-64"
      />
      <button
        onClick={handleJoinRoom}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Join Room
      </button>
    </div>
  );
}