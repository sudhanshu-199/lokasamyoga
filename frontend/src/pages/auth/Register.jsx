const Register = () => {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-2 mb-3"
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-3"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-3"
      />

      <select className="w-full border p-2 mb-4">
        <option>Select Role</option>
        <option>NGO</option>
        <option>Volunteer</option>
        <option>Donor</option>
      </select>

      <button className="w-full bg-green-600 text-white py-2 rounded">
        Register
      </button>
    </div>
  );
};

export default Register;
