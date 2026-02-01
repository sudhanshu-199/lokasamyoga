const NgoDashboard = () => {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        NGO Dashboard
      </h1>

      <div className="space-y-3">
        <div className="border p-4 rounded">
          Total Events Created: <strong>3</strong>
        </div>

        <div className="border p-4 rounded">
          Total Volunteers Registered: <strong>18</strong>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
