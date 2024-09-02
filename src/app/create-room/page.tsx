'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRoom() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    // Generate a unique room ID (you might want to use a more robust method)
    const newRoomId = Math.random().toString(36).substring(7);
    router.push(`/room/${newRoomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Room</h1>
      <button
        onClick={handleCreateRoom}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Room
      </button>
    </div>
  );
}