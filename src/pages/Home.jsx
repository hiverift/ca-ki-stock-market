import React from 'react'
import Hero from './Hero'
import OurSerive from './OurSerive'
import OurMentor from './OurMentor'
import Dropdown from './Dropdown'
import Subfooter from './Subfooter'
import Footer from './Footer'

const Home = () => {
  return (
    <div>
      
      <Hero />
      <OurSerive />
      <OurMentor />

    <Dropdown />
    <Subfooter/>
    <Footer/>
    </div>
  )
}

export default Home
