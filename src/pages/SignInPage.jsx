import React from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/pexels-pixabay-260447.jpg";

export default function SignInPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      terms: data.get("terms") === "on",
    });

  };

  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <img
        src={bgImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-0">

          <div className="bg-primary text-white rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl rounded-b-none md:rounded-bl-2xl p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Join the<br />Family
            </h2>
            <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-sm">
              Achieve your fitness goals with <span className="font-bold">Stride</span>: track workouts, monitor nutrition,
            and stay motivated every step of the way.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-md text-black rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl p-8 md:p-10 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">Sign In</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full rounded-md border border-black/10 bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-black/30"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full rounded-md border border-black/10 bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-black/30"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-black/70 select-none pt-1">
                <input
                  type="checkbox"
                  name="terms"
                  className="accent-black w-4 h-4"
                />
                Accept Terms &amp; Conditions
              </label>

              <button
                type="submit"
                className="w-full bg-black text-white font-semibold rounded-md py-3 mt-1 hover:opacity-90 transition"
                onClick={() => navigate("/dashboard")}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
