const VolunteerDashboard = () => {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Volunteer Dashboard
      </h1>

      <div className="space-y-3">
        <div className="border p-4 rounded">
          Events Registered: <strong>2</strong>
        </div>

        <div className="border p-4 rounded">
          NGOs Joined: <strong>1</strong>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
