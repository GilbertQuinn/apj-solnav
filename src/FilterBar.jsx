/* eslint-disable */
import React from "react"
import Button from "@cloudscape-design/components/button";

function FilterBar(props) {

    const cylinders = props.cylinderData

    function isSelected(num){
        return props.selectedFilter.includes(num)
    }

    function generateFilters(cylinders) {
        return cylinders.map((cylinder) => {
            return <Button key={cylinder.num} iconName={`${ isSelected(cylinder.num) ? "check" : "" }`} onClick={(event) => props.onFilterClick(event, cylinder.num)}>{cylinder.description}</Button>
        })
    }

    return <div className="topbar topbar-filter">
        <div>&nbsp;</div>
        <div>
            Filter:
            &nbsp;
            { generateFilters(cylinders) }
        </div>
    
    </div>
}

export default FilterBar