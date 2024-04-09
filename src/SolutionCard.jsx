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
            <div>
                <div className={`
                    ${ cylinderFound("C1", solution.scaleCylinder) ? "card-cylinder-box" : "card-cylinder-box-disabled" }`}>
                    <h2 className="card-h2">C1</h2></div>
                <div className={`
                    ${ cylinderFound("C2", solution.scaleCylinder) ? "card-cylinder-box" : "card-cylinder-box-disabled" }`}>
                    <h2 className="card-h2">C2</h2></div>
                <div className={`
                    ${ cylinderFound("C3", solution.scaleCylinder) ? "card-cylinder-box" : "card-cylinder-box-disabled" }`}>
                    <h2 className="card-h2">C3</h2></div>
                <div className={`
                    ${ cylinderFound("C4", solution.scaleCylinder) ? "card-cylinder-box" : "card-cylinder-box-disabled" }`}>
                    <h2 className="card-h2">C4</h2></div>
                <div className={`
                    ${ cylinderFound("C5", solution.scaleCylinder) ? "card-cylinder-box" : "card-cylinder-box-disabled" }`}>
                    <h2 className="card-h2">C5</h2></div>
            </div>
        </div>
  
    )
  }
  
export default SolutionCard