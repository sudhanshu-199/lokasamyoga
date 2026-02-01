import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Lokasamyoga</h1>

      <div className="flex gap-5 items-center">
        <Link to="/" className="hover:underline text-white">
          Home
        </Link>

        <Link to="/ngo/create-event" className="hover:underline text-white">
          Create Event
        </Link>

        <Link to="/volunteer/events" className="hover:underline text-white">
          Browse Events
        </Link>

        {/* TEMP DASHBOARD LINKS */}
        <Link to="/dashboard/ngo" className="hover:underline text-white">
          NGO Dashboard
        </Link>

        <Link to="/dashboard/volunteer" className="hover:underline text-white">
          Volunteer Dashboard
        </Link>

        <Link to="/dashboard/donor" className="hover:underline text-white">
          Donor Dashboard
        </Link>

        <Link
          to="/login"
          className="bg-white text-green-600 px-3 py-1 rounded"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
