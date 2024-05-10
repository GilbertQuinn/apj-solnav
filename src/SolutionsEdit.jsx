/* eslint-disable */
import React, { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
const API_URI = import.meta.env.VITE_API_URL;

//UI Components
import Modal from "@cloudscape-design/components/modal";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import Multiselect from "@cloudscape-design/components/multiselect";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import Input from "@cloudscape-design/components/input";
import Textarea from "@cloudscape-design/components/textarea";
import Spinner from "@cloudscape-design/components/spinner";

//Custom componenents
import SolutionEditSubList from "./SolutionEditSubList";


function SolutionEdit(props) {
     
  const [formData, setFormData] = useState(props.solution);
  const [selectedCylinders, setSelectedCylinders] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedThemeData, setSelectedThemeData] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  //Loading state - we should ideally not dulpicate this in the modal an instead use a library, but alas - time
  const [loading, setLoading] = React.useState(false)

  //Update cylinder data
  React.useEffect(() => {
    const mappedCylinders = props.cylinderData.map(cylinder => 
      formData.scaleCylinder.includes(cylinder.num) ? ({
        value: cylinder.num,
        label: cylinder.description,
        description: cylinder.description,
        selected: true
      }) : null // Add handling for when the condition is false if needed
    );
    setSelectedCylinders(mappedCylinders.filter(cyl => cyl !== null)); // Filter out any null entries if the condition is not met
  }, []);

  //Update region data
  React.useEffect(() => {
    const mappedRegions = props.regions.map(region => 
      formData.regions.includes(region.name) ? ({
        value: region.name,
        label: region.name,
        description: region.name,
        selected: true
      }) : null // Add handling for when the condition is false if needed
    );
    setSelectedRegions(mappedRegions.filter(reg => reg !== null)); // Filter out any null entries if the condition is not met
  }, []);

  //Update theme data
  React.useEffect(() => {
    const mappedThemes = props.themedata.map(theme => 
      formData.gtmTheme.includes(theme.name) ? ({
        value: theme.name,
        label: theme.name,
        description: theme.name,
        selected: true
      }) : null // Add handling for when the condition is false if needed
    );
    setSelectedThemeData(mappedThemes.filter(theme => theme !== null)); // Filter out any null entries if the condition is not met
  }, []);

  //Update industry data
  React.useEffect(() => {
    const mappedIndustries = props.industries.map(industry =>
      formData.industries.includes(industry) ? ({
        value: industry,
        label: industry,
        description: industry,
        selected: true
      }) : null // Add handling for when the condition is false if needed
    );
    setSelectedIndustries(mappedIndustries.filter(ind => ind !== null)); // Filter out any null entries if the condition is not met
  }, []);

  //When the selectedCylinders state changes, update the formData state with the new array of selected cylinders
  React.useEffect(() => {
    const selectedCylinderArray = selectedCylinders.map(cylinder => cylinder.value);
    setFormData((prev) => ({ ...prev, scaleCylinder: selectedCylinderArray }));
  }, [selectedCylinders])

  //When the region state changes, update the formData state with the new array of selected regions
  React.useEffect(() => {
    const selectedRegionArray = selectedRegions.map(region => region.value);
    setFormData((prev) => ({ ...prev, regions: selectedRegionArray }));
  }, [selectedRegions])

  //When the theme state changes, update the formData state with the new array of selected gtm theme
  React.useEffect(() => {
    const selectedThemeArray = selectedThemeData.map(theme => theme.value);
    setFormData((prev) => ({ ...prev, gtmTheme: selectedThemeArray }));
  }, [selectedThemeData])

  //When the industry state changes, update the formData state with the new array of selected industries
  React.useEffect(() => {
    const selectedIndustryArray = selectedIndustries.map(industry => industry.value);
    setFormData((prev) => ({ ...prev, industries: selectedIndustryArray }));
  }, [selectedIndustries])

  //Generic change event for regular input fields
  const handleChange = (event, name) => {
    setFormData((prev) => ({ ...prev, [name]: event.detail.value }));
  };

  //Change event for sublists of name, decription, url
  const handleListChange = (event, listName, name, id) => {
    const value = event.detail.value;
    //const { id, name, value } = event.target;
    //Find the item in the list based on index and update the values
    const updatedItem = formData[listName].map((item, i) => {
      if (i == id) {
        return { ...item, [name]: value };
      }
      return item;
    });
    //Now update the item to the sub list of solution
    setFormData((prev) => ({ ...prev, [listName]: updatedItem }));
  };

  //Handle list item delete click
  const handleListItemDelete = (listName, index) => {
    //Remove the item from the list
    const updatedList = formData[listName].filter((item, i) => i !== index);
    //Now update the item to the sub list of solution
    setFormData((prev) => ({ ...prev, [listName]: updatedList }));
  };

  //Add Blank Item to a sublist
  const handleAddItem = (listName) => {
    //Add a blank item to the list
    setFormData((prev) => ({ ...prev, [listName]: [...prev[listName], { name: '', description: '', url: '' }] }));
  };

  //Handle Submit Event and update the data back to the main state
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      const { _id, ...updateData } = formData;
      const token = Cookies.get('jwt');
      const response = await axios.put(`${API_URI}/solutions/${formData._id}`, updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      props.onUpdate(formData);
      console.log('Solution updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      console.log('Failed to update solution');
    } finally {
      setLoading(false)
    }
  };

  //execute only if a solution is defined
  return props.solution && 
  <Modal
    onDismiss={() => props.setVisible(false)}
    visible={props.visible}
    size="large"
    header="AWS Solution Detail"
  >

    <form onSubmit={e => e.preventDefault()}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            {loading && <Spinner />}
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>Submit</Button>
          </SpaceBetween>
        }
      >
        <Container
          header={
            <Header variant="h2">
              Main Solution Detail Detail
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="l">

            <ExpandableSection headerText="Solution Detail">

              <FormField label="Solution Name">
                <Input required type="text" name="solutionName" value={formData.solutionName} onChange={(e) => handleChange(e,"solutionName")}/>
              </FormField>

              <FormField label="Website URL">
                <Input type="text" name="officialURL" value={formData.officialURL} onChange={(e) => handleChange(e,"officialURL")}/>
              </FormField>

              <FormField label="AWS Partner URL">
                <Input required className="form-input" type="text" name="marketPlaceURL" value={formData.marketPlaceURL} onChange={(e) => handleChange(e,"marketPlaceURL")}/>
              </FormField>

              <FormField label="AWS Marketplace Solution URL">
                <Input required className="form-input" type="text" name="solutionsURL" value={formData.solutionsURL} onChange={(e) => handleChange(e,"solutionsURL")}/>
              </FormField>

              <FormField label="CSC Blueprint URL">
                <Input required className="form-input" type="text" name="blueprintURL" value={formData.blueprintURL} onChange={(e) => handleChange(e,"blueprintURL")}/>
              </FormField>

              <FormField label="AWS Buyers Guide">
                <Input required className="form-input" type="text" name="buyersGuideURL" value={formData.buyersGuideURL} onChange={(e) => handleChange(e,"buyersGuideURL")}/>
              </FormField>

              <FormField label="Partner Discover Portal">
                <Input required className="form-input" type="text" name="discPortal" value={formData.discPortal} onChange={(e) => handleChange(e,"discPortal")}/>
              </FormField>

              <FormField label="Description">
                <Textarea name="description" value={formData.description}  onChange={(e) => handleChange(e,"description")}/>
              </FormField>

              <FormField label="Scale Cylinders">
              <Multiselect
                      selectedOptions={selectedCylinders}
                      onChange={({ detail }) =>
                        setSelectedCylinders(detail.selectedOptions)
                      }
                      options={
                          props.cylinderData.map((cylinder) => {
                              return {
                                  label: cylinder.description,
                                  value: cylinder.num
                              }
                          })
                      }
                          filteringType="auto"
                          hideTokens
                          placeholder="Choose Scale Cylinder(s)"
                  />
              </FormField>

              <FormField label="Region">
              <Multiselect
                      selectedOptions={selectedRegions}
                      onChange={({ detail }) =>
                        setSelectedRegions(detail.selectedOptions)
                      }
                      options={
                          props.regions.map((region) => {
                              return {
                                  label: region.name,
                                  value: region.name
                              }
                          })
                      }
                          filteringType="auto"
                          hideTokens
                          placeholder="Choose Region(s)"
                  />
              </FormField>

              <FormField label="GTM Theme">
              <Multiselect
                      selectedOptions={selectedThemeData}
                      onChange={({ detail }) =>
                        setSelectedThemeData(detail.selectedOptions)
                      }
                      options={
                          props.themedata.map((region) => {
                              return {
                                  label: region.name,
                                  value: region.name
                              }
                          })
                      }
                          filteringType="auto"
                          hideTokens
                          placeholder="Choose GTM Theme(s)"
                  />
              </FormField>
              
              <FormField label="Related Industries">
              <Multiselect
                      selectedOptions={selectedIndustries}
                      onChange={({ detail }) =>
                        setSelectedIndustries(detail.selectedOptions)
                      }
                      options={
                          props.industries.map((industry) => {
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
              </FormField>
              

            </ExpandableSection>
            
            <ExpandableSection headerText="Related Documents">
            <p>This section is for any internal external artefacts related to the solutions including (but not limited to) Battle Cards, Blogs, Highspot Content etc.</p>

            <SolutionEditSubList
                handleAddItem={handleAddItem}
                handleChange={handleChange}
                handleListChange={handleListChange}
                handleListItemDelete={handleListItemDelete}
                subList={formData.otherDocuments}
                subListName="otherDocuments"
                >
                </SolutionEditSubList>  

            </ExpandableSection>

            <ExpandableSection headerText="Customer References">
            <p>This section is for any internal / external customer references. Mainly found on the AWS Partner Page or the Vendors Official Website.</p>

              <SolutionEditSubList
                handleAddItem={handleAddItem}
                handleChange={handleChange}
                handleListChange={handleListChange}
                handleListItemDelete={handleListItemDelete}
                subList={formData.customerReferences}
                subListName="customerReferences"
                >
                </SolutionEditSubList>

            </ExpandableSection>

            <ExpandableSection headerText="Solution Training">
            <p>This section is for any internal / external training specifically on / or including the ISV Solution or AWS.</p>

              <SolutionEditSubList
                handleAddItem={handleAddItem}
                handleChange={handleChange}
                handleListChange={handleListChange}
                handleListItemDelete={handleListItemDelete}
                subList={formData.trainingURLs}
                subListName="trainingURLs"
                >
                </SolutionEditSubList>

            </ExpandableSection>

            <ExpandableSection headerText="Consulting Partners">
            <p>List of consulting partners that can implement / integrate this solution for the end customer.</p>

              <SolutionEditSubList
                handleAddItem={handleAddItem}
                handleChange={handleChange}
                handleListChange={handleListChange}
                handleListItemDelete={handleListItemDelete}
                subList={formData.consultingPartners}
                subListName="consultingPartners"
                >
                </SolutionEditSubList>

            </ExpandableSection>

          </SpaceBetween>
        </Container>
      </Form>
    </form>

  </Modal>

}

export default SolutionEdit;