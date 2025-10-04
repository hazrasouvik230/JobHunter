import React from 'react'
import Companies from '../../Companies'
import Loading from "../../Loading"
import FilterBar from '../../FilterBar'
import Hero from "./Hero"
import JobPilot from './JobPilot'

const Home = () => {
  return (
    <div className='pt-16'>
      {/* <p>This is home page</p> */}
      <Hero />
      <Companies />
      <JobPilot />
      {/* <Loading /> */}
      {/* <FilterBar /> */}
    </div>
  )
}

export default Home