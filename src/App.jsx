/* eslint-disable */
import React from "react"
import './App.css'
import axios from 'axios';

//UI Componenets
import TopBar from "./TopBar";
import SolutionCard from "./SolutionCard";
import FilterBar from "./FilterBar";
import SolutionDetail from "./SolutionDetail";
import SolutionsEdit from "./SolutionsEdit";

//Cloudscapte Design Elements
import {Container,ContentLayout,} from '@cloudscape-design/components';
import {I18nProvider} from '@cloudscape-design/components/i18n';
import Toggle from "@cloudscape-design/components/toggle";
import messages from '@cloudscape-design/components/i18n/messages/all.en';

const LOCALE = 'en';
const API_URI = import.meta.env.VITE_API_URL;

function App() {  

  //Modal State
  const [modalVisible, setModalVisible] = React.useState(false);
  const [solutionEditVisible, setSolutionEditVisible] = React.useState(false);
  const [admin, setAdmin] = React.useState(true);

  //Solutions Data
  const [solutions, setSolutions] = React.useState([])
  const [selectedSolutionId, setSelectedSolutionID] = React.useState()
  const [selectedSolution, setSelectedSolution] = React.useState()
  const prevSelectedSolutionId = React.useRef(selectedSolutionId);

  //Filters
  const [selectedIndustries, setSelectedIndustries] = React.useState([])
  const [selectedCylinders, setSelectedCylinders] = React.useState([])
  //const [cylinderFilter, setCylinderFilter] = React.useState([])
  const [filterText, setFilterText] = React.useState("")

  //Lookup data
  const [cylinderData, setCylinderData] = React.useState([])
  const [themedata, setThemeData] = React.useState([])
  const [resourcesData, setResourcesData] = React.useState([])
  const [regionData, setRegionData] = React.useState([])
  const [industries, setIndustries] = React.useState([])

  //Load initial data once
  React.useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        // Load solutions data
        const solutionsResponse = await axios.get(`${API_URI}/solutions`);
        setSolutions(solutionsResponse.data);
  
        // Load cylinder data
        const cylinderDataResponse = await axios.get(`${API_URI}/lookups/cylinderdata`);
        setCylinderData(cylinderDataResponse.data);

        // Load theme data
        const themeDataResponse = await axios.get(`${API_URI}/lookups/themedata`);
        setThemeData(themeDataResponse.data);

        // Load theme data
        const resourcesDataResponse = await axios.get(`${API_URI}/lookups/resourcesdata`);
        setResourcesData(resourcesDataResponse.data);

        // Load region data
        const regionDataResponse = await axios.get(`${API_URI}/lookups/regiondata`);
        setRegionData(regionDataResponse.data);
  
        // You can continue loading more data here in the same manner
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchDataSequentially();
  }, []);

  //Create a unique list of industries from the solutions data
  React.useEffect(() => {
    const uniqueIndustries = []
    for (let i = 0; i < solutions.length; i++) {
      let industries = solutions[i].industries
      for (let j = 0; j < industries.length; j++) {
        let industryItem = industries[j]
        if (!uniqueIndustries.includes(industryItem)) {
          uniqueIndustries.push(industryItem)
        }
      }
    }
    setIndustries(uniqueIndustries)
  }, [solutions])

  //create simple cylinder filter from cylinder data
  React.useEffect(() => {
    const cylinders = cylinderData.map(cylinder => cylinder.num)
    //setCylinderFilter(cylinders) 
    setSelectedCylinders([])
  }, [cylinderData]) 

  //Open model when card is clicked
  React.useEffect(() => {
    if (prevSelectedSolutionId.current !== selectedSolutionId) {
      const selectedSolution = solutions.find(solution => solution._id === selectedSolutionId)
      selectedSolution && setSelectedSolution(selectedSolution)

      if (admin) {
        setSolutionEditVisible(true)
      } else {
        setModalVisible(true)
      }
    }
  }, [selectedSolutionId, solutions])

  //Filter out cards by the selected cylinder
  //function cardInFilter(cardCylinders) {
    //return cardCylinders.some(item => cylinderFilter.includes(item))
  //}

  //Filter out cards by selected industry
  function cardInIndustry(cardIndustries) {
    return (selectedIndustries.length === 0) || (selectedIndustries.some(item => cardIndustries.includes(item.value)))
  }

  //Filter out the cards by cylinder
  function cardInCylinders(cardCylinders) {
    return (selectedCylinders.length == 0) || (selectedCylinders.some(item => cardCylinders.includes(item.value)))
  }

  //Filter throught the solutions object list based on a text search terms
// Filter through the solutions object list based on a text search term, including searching within nested lists.
  function filterSolutions(searchTerm, solution) {
    if (searchTerm === "") return true;

    const value = searchTerm.toLowerCase();

    // Helper function to recursively search within objects and arrays
    function searchInItem(item) {
      if (typeof item === 'string') {
        return item.toLowerCase().includes(value);
      } else if (Array.isArray(item)) {
        // If the item is an array, search each element.
        return item.some(element => searchInItem(element));
      } else if (typeof item === 'object' && item !== null) {
        // If the item is an object, search each value.
        return Object.values(item).some(subItem => searchInItem(subItem));
      }
      return false;
    }

    // Go through each key in the solution object and use searchInItem to check for matches.
    return Object.values(solution).some(searchInItem);
  }


  //Generate the columns for each gtmTheme
  function solutionThemes() {
    //Switched to using a loop instead of .map so we can generate a key for each item
    const solutionThemes = []
    for (let i = 0; i < themedata.length; i++) {
      solutionThemes.push(
        <section key={themedata[i]._id} className="cards-list">
          <div key={themedata[i]._id} className="card cardHeader">{themedata[i].name}</div>
          {solutionCards(themedata[i].name)}
        </section>
      ) 
    }
    return solutionThemes
  }

  //Filter Click event to pass to the filter bar
  function setSelectedFilter(event, cylinder) {
    event.stopPropagation()
    if ((cylinderFilter.length == 5) && cylinderFilter.includes(cylinder)) {
      //For UX, if all is selected, assume the want only the selected item
      const newArray = [cylinder]  
      setCylinderFilter(newArray)
    } else if (cylinderFilter.includes(cylinder)) {
      // Remove the cylinder from the cylinderFilter array
      const newArray = cylinderFilter.filter((item) => item !== cylinder)
      setCylinderFilter(newArray)
    } else {
      // Add the cylinder to the cylinderFilter array
      const newArray = [...cylinderFilter, cylinder]
      setCylinderFilter(newArray)
    }
  }

  //Generate all cards for a specific theme including the cylinder filters
  function solutionCards(gtmTheme) {
    const solutionCards = solutions.map((solution) => {
      const divKey = solution._id + gtmTheme
      //return cardInFilter(solution.scaleCylinder)
      return cardInCylinders(solution.scaleCylinder)
        &&
        solution.gtmTheme.includes(gtmTheme)
        &&
        cardInIndustry(solution.industries)
        &&
        filterSolutions(filterText,solution)
        &&
        <SolutionCard key={divKey} solution={solution} setSolutionId={setSelectedSolutionID}></SolutionCard>
    })
    return solutionCards
  }

  // Function to handle updating the solution in the main state
  const handleUpdateSolution = (updatedSolution) => {
      const updatedSolutions = solutions.map(solution =>
          solution._id === updatedSolution._id ? updatedSolution : solution
      );
      setSolutions(updatedSolutions);
  };

  //Close the detail view
  const closeModel = () => {
    setSelectedSolutionID()
    setSelectedSolution()

    if (admin) {
      setSolutionEditVisible(false)
    } else {
      setModalVisible(false)
    }
    
  }

//onFilterClick={setSelectedFilter}

  return (

    <I18nProvider locale={LOCALE} messages={[messages]}>

      <Toggle
        onChange={({ detail }) => (
          setAdmin(detail.checked)
        ) 
          }
          checked={admin}
        >
          Admin
      </Toggle>

      <TopBar resources={resourcesData}></TopBar>
      <FilterBar cylinderData={cylinderData} industries={industries} setSelectedCylinders={setSelectedCylinders} setSelectedIndustries={setSelectedIndustries} setFilterText={setFilterText}></FilterBar>


      <ContentLayout>
        <Container>
        
          <div className="card-columns">
            {solutionThemes()}
          </div>

          { selectedSolution && modalVisible        &&  <SolutionDetail setVisible={closeModel} cylinderData={cylinderData} visible={modalVisible}        solution={selectedSolution}></SolutionDetail>}
          { selectedSolution && solutionEditVisible &&  
            <SolutionsEdit
              setVisible={closeModel}
              cylinderData={cylinderData}
              visible={solutionEditVisible}
              solution={selectedSolution}
              regions={regionData}
              onUpdate={handleUpdateSolution}
              themedata={themedata}
              industries={industries}>
            </SolutionsEdit>}

        </Container>
      </ContentLayout>

      </I18nProvider>

  )
}

export default App
