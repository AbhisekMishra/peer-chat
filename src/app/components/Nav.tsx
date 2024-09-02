export default function Nav() {
  return (
    <nav className="w-full bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
        <h1 className="text-xl font-bold mb-2 sm:mb-0">PeerChat</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-gray-300">Home</a></li>
          <li><a href="/about" className="hover:text-gray-300">About</a></li>
          <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}