const EventCard = () => {
  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="text-lg font-semibold">Tree Plantation Drive</h3>
      <p className="text-sm text-gray-600">Date: 15 Feb 2026</p>
      <p className="text-sm">Location: Mohali</p>
      <p className="mt-2 text-sm">
        Join us to make the city greener 🌱
      </p>

      <span className="inline-block mt-2 text-xs text-green-700">
        Upcoming
      </span>

      <button className="block mt-3 bg-blue-600 text-white px-3 py-1 rounded">
        Register
      </button>
    </div>
  );
};

export default EventCard;
