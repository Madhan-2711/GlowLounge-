import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';

const Home = ({ session }) => {
  return (
    <>
      <Hero session={session} />
      <Features />
    </>
  );
};

export default Home;
