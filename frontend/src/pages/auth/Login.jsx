const Login = () => {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

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

      <button className="w-full bg-green-600 text-white py-2 rounded">
        Login
      </button>
    </div>
  );
};

export default Login;
