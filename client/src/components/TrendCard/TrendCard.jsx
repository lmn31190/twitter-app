import React from 'react'
import './trendCard.css'

import {TrendData} from '../../Data/TrendData.js'
const TrendCard = () => {
  return (
    <div className="TrendCard">
            <h3>Tendances pour vous</h3>
            {TrendData.map((trend, id)=>{
                return(
                    <div className="trend" key={id}>
                        <span>#{trend.name}</span>
                        <span>{trend.shares}k partages</span>
                    </div>
                )
            })}

    </div>
  )
}

export default TrendCard