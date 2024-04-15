import React from "react"
import './App.css'
import TopBar from "./TopBar";
import {Container,ContentLayout,} from '@cloudscape-design/components';
import {I18nProvider} from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import SolutionCard from "./SolutionCard";
import FilterBar from "./FilterBar";
import SolutionDetail from "./SolutionDetail";
import axios from 'axios';

const LOCALE = 'en';
const API_URI = import.meta.env.VITE_API_URL;

function App() {

  //Declare our global state that we will pass to components
  const [solutions, setSolutions] = React.useState([])
  const [cylinderFilter, setCylinderFilter] = React.useState([])
  const [selectedSolutionId, setSelectedSolutionID] = React.useState()
  const [selectedSolution, setSelectedSolution] = React.useState()
  //const [gtmThemes] = React.useState([])
  const [visible, setVisible] = React.useState(false);
  const prevSelectedSolutionId = React.useRef(selectedSolutionId);

  const [industries, setIndustries] = React.useState([])
  const [selectedIndustries, setSelectedIndustries] = React.useState([])

  //Lookup data
  const [cylinderData, setCylinderData] = React.useState([])
  const [themedata, setThemeData] = React.useState([])
  const [resourcesData, setResourcesData] = React.useState([])

  //Load initial data once
  React.useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        // Load solutions data
        const solutionsResponse = await axios.get(`${API_URI}/solutions`);
        setSolutions(solutionsResponse.data);
  
        // Load cylinder data
        const cylinderDataResponse = await axios.get(`${API_URI}/cylinderdata`);
        setCylinderData(cylinderDataResponse.data);

        // Load theme data
        const themeDataResponse = await axios.get(`${API_URI}/themedata`);
        setThemeData(themeDataResponse.data);

        // Load theme data
        const resourcesDataResponse = await axios.get(`${API_URI}/resourcesdata`);
        setResourcesData(resourcesDataResponse.data);
  
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
    setCylinderFilter(cylinders) 
  }, [cylinderData]) 

  //Open model when card is clicked
  React.useEffect(() => {
    if (prevSelectedSolutionId.current !== selectedSolutionId) {
      const selectedSolution = solutions.find(solution => solution._id === selectedSolutionId)
      selectedSolution && setSelectedSolution(selectedSolution)
      setVisible(true)
    }
  }, [selectedSolutionId, solutions])

  //Filter out cards by the selected cylinder
  function cardInFilter(cardCylinders) {
    return cardCylinders.some(item => cylinderFilter.includes(item))
  }

  //Filter out cards by selected industry
   function cardInIndustry(cardIndustries) {
    return (selectedIndustries.length == 0) || (selectedIndustries.some(item => cardIndustries.includes(item.value)))
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
      return cardInFilter(solution.scaleCylinder)
        &&
        solution.gtmTheme.includes(gtmTheme)
        &&
        cardInIndustry(solution.industries)
        &&
        <SolutionCard key={divKey} solution={solution} setSolutionId={setSelectedSolutionID}></SolutionCard>
    })
    return solutionCards
  }

  //Close the detail view
  const closeModel = () => {
    setSelectedSolutionID()
    setSelectedSolution()
    setVisible(false)
  }

  return (

    <I18nProvider locale={LOCALE} messages={[messages]}>
      <TopBar resources={resourcesData}></TopBar>
      <FilterBar onFilterClick={setSelectedFilter} cylinderData={cylinderData} selectedFilter={cylinderFilter} industries={industries} setSelectedIndustries={setSelectedIndustries}></FilterBar>

      <ContentLayout>
        <Container>
        
          <div className="card-columns">
            {solutionThemes()}
          </div>

          <SolutionDetail setVisible={closeModel} cylinderData={cylinderData} visible={visible} solution={selectedSolution}></SolutionDetail>

        </Container>
      </ContentLayout>

    </I18nProvider>

  )
}

export default App
