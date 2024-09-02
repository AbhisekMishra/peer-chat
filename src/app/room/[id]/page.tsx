'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import Peer from 'peerjs';

export default function Room() {
  const { id } = useParams();
  const [peers, setPeers] = useState<{ [key: string]: any }>({});
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const socketRef = useRef<any>();
  const peerRef = useRef<any>();
  const userVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socketRef.current = io({
      path: '/api/socket',
    });
    
    peerRef.current = new Peer();

    peerRef.current.on('open', (peerId: string) => {
      console.log('My peer ID is: ' + peerId);
      socketRef.current.emit('join-room', id, peerId);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setUserStream(stream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        socketRef.current.on('user-connected', (userId: string) => {
          console.log('User connected:', userId);
          connectToNewUser(userId, stream);
        });

        peerRef.current.on('call', (call: any) => {
          console.log('Receiving call from:', call.peer);
          call.answer(stream);
          call.on('stream', (userVideoStream: MediaStream) => {
            console.log('Received stream from:', call.peer);
            addVideoStream(call.peer, userVideoStream);
          });
        });

        socketRef.current.on('user-disconnected', (userId: string) => {
          console.log('User disconnected:', userId);
          if (peers[userId]) {
            peers[userId].close();
            setPeers(prevPeers => {
              const newPeers = { ...prevPeers };
              delete newPeers[userId];
              return newPeers;
            });
          }
        });
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      socketRef.current.disconnect();
      userStream?.getTracks().forEach(track => track.stop());
      Object.values(peers).forEach((peer: any) => peer.close());
    };
  }, [id]);

  function connectToNewUser(userId: string, stream: MediaStream) {
    console.log('Connecting to new user:', userId);
    const call = peerRef.current.call(userId, stream);
    call.on('stream', (userVideoStream: MediaStream) => {
      console.log('Received stream from user:', userId);
      addVideoStream(userId, userVideoStream);
    });
    call.on('close', () => {
      console.log('Call closed with user:', userId);
      setPeers(prevPeers => {
        const newPeers = { ...prevPeers };
        delete newPeers[userId];
        return newPeers;
      });
    });
    setPeers(prevPeers => ({
      ...prevPeers,
      [userId]: call
    }));
  }

  function addVideoStream(userId: string, stream: MediaStream) {
    console.log('Adding video stream for user:', userId);
    setPeers(prevPeers => ({
      ...prevPeers,
      [userId]: stream
    }));
  }

  console.log(peers);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Room: {id}</h1>
      <div className="grid grid-cols-2 gap-4">
        <video ref={userVideoRef} autoPlay playsInline className="w-full h-auto" />
        {Object.entries(peers).map(([peerId, stream]) => (
          <video 
            key={peerId} 
            autoPlay 
            playsInline
            className="w-full h-auto" 
            ref={el => {
              if (el && stream instanceof MediaStream) {
                el.srcObject = stream;
              } else {
                console.error('Invalid stream for peer:', peerId, stream);
              }
            }} 
          />
        ))}
      </div>
    </div>
  );
}