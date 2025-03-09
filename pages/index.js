import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseBrowserClient";

export default function Register() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const currentUser = data.session.user;
        setUser(currentUser);
        fetchUserDetails(currentUser.email);
      }
    };

    checkSession();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://supabasesignup.vercel.app", // Redirects back to signup app
      },
    });
    setLoading(false);
  };
  
  

  const fetchUserDetails = async (email) => {
    const { data } = await supabase.from("users").select("name").eq("email", email).single();
    if (data) {
      setName(data.name);
      setRegistered(true);
    }
  };

  const handleRegistration = async () => {
    if (!name) return alert("Please enter your name");
    await supabase.from("users").insert([{ id: user.id, name, email: user.email }]);
    setRegistered(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRegistered(false);
    setName("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Registration App</h1>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-700 text-sm">
                {registered ? `Registered as ${name || user.email}` : "Not Registered"}
              </span>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-5xl font-extrabold text-gray-900">Hello World</h1>
      </div>

      {/* Registration Section */}
      <div className="flex flex-col items-center pb-20">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
          {!user ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Sign up with Google</h2>
              <button
                onClick={signInWithGoogle}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
              >
                {loading ? "Loading..." : "Sign in with Google"}
              </button>
            </>
          ) : registered ? (
            <h2 className="text-green-500 font-semibold">✅ Now you can log in on Project 2!</h2>
          ) : (
            <>
              <p className="mb-4 text-gray-600">Enter your name to complete registration</p>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleRegistration}
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
              >
                Complete Registration
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
