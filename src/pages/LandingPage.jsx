import React from 'react'
import MyNavBar from '../components/MyNavBar'
import MyFooter from '../components/MyFooter'

import heroImg from "../assets/pexels-victorfreitas-841130.jpg";
import aboutImg from "../assets/Fit analytics.png"

const LandingPage = () => {
  return (
    <>
     <MyNavBar />

     {/* HERO SECTION */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-media">
          <img src={heroImg} alt="Athlete training background" />
        </div>

        <div className="hero-content left">
          <h1 id="hero-heading" className="hero-title">
            Stay On <span className='text-primary'>Track</span>
          </h1>
          <p className="hero-subtitle">
            Achieve your fitness goals with Stride: track workouts, monitor nutrition,
            and stay motivated every step of the way.
          </p>
          <button
            className="btn btn-primary cursor-pointer"
            onClick={() => (window.location.href = "/signin")}
          >
            Join Us
          </button>
        </div>
      </section>


      {/* ABOUT US SECTION */}
      <section
      className="flex flex-wrap items-center justify-between px-8 py-16"
      id="about"
    >
      {/* Illustration */}
      <div className="flex justify-center items-center flex-1 min-w-[280px] mb-8 md:mb-0">
        <img
          src={aboutImg}
          alt="Athlete using smartwatch"
          className="w-full max-w-[800px] h-auto object-contain"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col flex-1 min-w-[280px] md:pl-8 text-left">
        <h2 className="text-primary text-10xl md:text-5xl font-extrabold mb-4 tracking-tight uppercase">
          About Us
        </h2>

        <p className="text-black text-base md:text-lg leading-relaxed mb-6 max-w-xl">
          At <span className="font-bold">Stride Fitness Tracker</span>, we're dedicated
          to helping you stay consistent and reach your goals. Whether you're training at
          home or in the gym, Stride gives you the tools to track your performance,
          nutrition, and progress all in one sleek, focused experience.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-xl w-fit transition-all duration-200 hover:-translate-y-1 cursor-pointer"
        >
          <a href="mailto:shambi.hamisi@gmail.com">Contact Us</a>
        </button>
      </div>
    </section>

    <MyFooter />
    </>
  );
}

export default LandingPage