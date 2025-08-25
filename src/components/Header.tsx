import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
      </nav>
      <nav className="flex flex-row gap-4">
        <div className="px-2">
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
