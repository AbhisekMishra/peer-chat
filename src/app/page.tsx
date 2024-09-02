import Image from "next/image";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <Image
            className="mx-auto mb-4"
            src="/next.svg"
            alt="Next.js Logo"
            width={120}
            height={25}
            priority
          />
          <h1 className="text-2xl font-bold mb-2">Welcome to PeerChat</h1>
          <p className="text-sm text-gray-600">Connect and chat with peers instantly</p>
        </div>
        <div className="grid gap-4 w-full max-w-sm">
          <Link href="/create-room" className="block p-4 border rounded-lg hover:bg-gray-100 transition-colors text-center">
            <h2 className="text-xl font-semibold mb-2">Create Room</h2>
            <p className="text-sm text-gray-600">Start a new video chat room</p>
          </Link>
          <Link href="/join-room" className="block p-4 border rounded-lg hover:bg-gray-100 transition-colors text-center">
            <h2 className="text-xl font-semibold mb-2">Join Room</h2>
            <p className="text-sm text-gray-600">Enter an existing video chat room</p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
