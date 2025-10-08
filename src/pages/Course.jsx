import React from 'react'
import Navbar from '../components/Navbar'
import CourseHero from '../coursecontent/CourseHero'
import Category from"../course/Category"
import CourseBenefits from '../course/CourseBenefits.jsx'
import Footer from './Footer.jsx'

const Course = () => {
  return (
    <div className='font-sans'>
      <Navbar/>
      <CourseHero/>
      {/* <Category/> */}
      <CourseBenefits/>
      <Footer className=""/>
    </div>
  )
}

export default Course
