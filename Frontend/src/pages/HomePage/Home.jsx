import React from 'react'
import Companies from '../../Companies'
import Loading from "../../Loading"
import FilterBar from '../../FilterBar'

const Home = () => {
  return (
    <div>
      <p>This is home page</p>
      <Companies />
      {/* <Loading /> */}
      <FilterBar />
    </div>
  )
}

export default Home