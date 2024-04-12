/* eslint-disable */
import React from "react"
import Button from "@cloudscape-design/components/button";
import Multiselect from "@cloudscape-design/components/multiselect";

function FilterBar(props) {

    const cylinders = props.cylinderData
    const industries = props.industries
    const [selectedOptions,setSelectedOptions] = React.useState([])

    //If the selected options change, do a call back to the app on props.setSelectedIndustries with the list of selected industries
    React.useEffect(() => {
        props.setSelectedIndustries(selectedOptions)
    }, [selectedOptions])

    function isSelected(num){
        return props.selectedFilter.includes(num)
    }

    function generateFilters(cylinders) {
        return cylinders.map((cylinder) => {
            return <Button key={cylinder.num} iconName={`${ isSelected(cylinder.num) ? "check" : "" }`} onClick={(event) => props.onFilterClick(event, cylinder.num)}>{cylinder.description}</Button>
        })
    }

    return <div className="topbar topbar-filter">
         
        <div className="topbar-filter-columns">
            <div className="topbar-filter-columns">
                Filter:
            </div>
            <div className="multiselectBox topbar-filter-columns">
                <Multiselect
                    selectedOptions={selectedOptions}
                    onChange={({ detail }) =>
                        setSelectedOptions(detail.selectedOptions)
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
            <div className="topbar-filter-columns">
                { generateFilters(cylinders) }
            </div>
        </div>
    
    </div>
}

export default FilterBar