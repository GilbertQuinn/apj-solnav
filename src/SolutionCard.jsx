/* eslint-disable */
import React from "react"
import { getImageURL } from "./utils/image-util";

function SolutionCard(props) {
    const solution = props.solution;

    //Highlight the applicable cylinders
    function cylinderFound(num, cylinders) {    
        return cylinders.find(cylinder => cylinder === num)
    }

    return (
        
        <div className="card" onClick={() => props.setSolutionId(solution._id)}>
            <div className="image-solution-logo-container">
                <img src={getImageURL(solution.logoImage)} title={solution.solutionName} className="image-solution-logo" />
            </div>
            <p className="card-links">
                <a href={solution.marketPlaceURL} target="_new">AWS Marketplace</a> |
                <a href={solution.officialURL} target="_new">Official Site</a>
            </p>
            
        </div>
  
    )
  }
  
export default SolutionCard