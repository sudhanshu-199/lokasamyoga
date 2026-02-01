const CreateEvent = () => {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      <input
        type="text"
        placeholder="Event Title"
        className="w-full border p-2 mb-3"
      />

      <input
        type="date"
        className="w-full border p-2 mb-3"
      />

      <input
        type="text"
        placeholder="Location"
        className="w-full border p-2 mb-3"
      />

      <textarea
        placeholder="Event Description"
        className="w-full border p-2 mb-3"
      />

      <button className="w-full bg-green-600 text-white py-2 rounded">
        Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
