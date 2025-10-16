import React from 'react'
import MyNavBar from '../components/MyNavBar'

import heroImg from "../assets/pexels-victorfreitas-841130.jpg";

const LandingPage = () => {
  return (
    <>
     <MyNavBar />
     <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-media" role="img" aria-label="Athlete training background">
          <img src={heroImg} alt=""/>
        </div>
     </section>
    </>
  );
}

export default LandingPage