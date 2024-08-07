/* eslint-disable */
import React from "react"
import Button from "@cloudscape-design/components/button";
import Multiselect from "@cloudscape-design/components/multiselect";
import Input from "@cloudscape-design/components/input";

function FilterBar(props) {

    const cylinders = props.cylinderData
    const industries = props.industries
    const [selectedIndustries,setSelectedIndustries] = React.useState([])
    const [value, setValue] = React.useState("");


    React.useEffect(() => {
        props.setSelectedIndustries(selectedIndustries)
    }, [selectedIndustries])

    /*function isSelected(num){
        return props.selectedFilter.includes(num)
    }*/

    /*function generateFilters(cylinders) {
        return cylinders.map((cylinder) => {
            return <Button key={cylinder.num} iconName={`${ isSelected(cylinder.num) ? "check" : "" }`} onClick={(event) => props.onFilterClick(event, cylinder.num)}>{cylinder.description}</Button>
        })
    }*/

    return <div className="topbar">
         
    <div className="topbar-columns topbar-column-left">
        <Button onClick={props.aibuttonClick}>Solution Advisor (Alpha)</Button>
    </div>       
    
    <div className="topbar-columns topbar-column-right">
        <div className="topbar-columns">
            Filter:
        </div>
        <div className="topbar-columns">
            <Input
                onChange={({ detail }) => {
                    setValue(detail.value)
                    props.setFilterText(detail.value)
                }}
                value={value}
                />
        </div>
        <div className="topbar-columns">
            <Multiselect
                selectedOptions={selectedIndustries}
                onChange={({ detail }) =>
                    setSelectedIndustries(detail.selectedOptions)
                }
                options={
                    industries.map((industry) => {
                        return {
                            label: industry,
                            value: industry
                        }
                    })
                }
                    filteringType="auto"
                    hideTokens
                    placeholder="Choose Industries"
            />
        </div>
        
    </div>
    
    </div>
}

export default FilterBar