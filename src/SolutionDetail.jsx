/* eslint-disable */
import Modal from "@cloudscape-design/components/modal";
import Badge from "@cloudscape-design/components/badge";
import Icon from "@cloudscape-design/components/icon";
import { getImageURL } from "./utils/image-util";

function SolutionDetail(props) {
     
    const solution = props.solution
    const cylindersData = props.cylinderData
    

    //Create the cylinder view based on cylinderData, but only if it exists in the solutions cylinder array
    function cylinders(cylinders, cylinderData) {
        return cylinderData.map(cylinder => {
            return <div key={cylinder.num} className="modal-content-column">
                <Badge color={ cylinders.includes(cylinder.num)  ? "blue" : "grey" }>{cylinder.description}</Badge>
            </div>
        })
    }

    //generate list of an array of references
    function solutionReferences(references) {
        return references.map(reference => {
            return <div key={reference.name}>
                    <p>
                        <strong><a href={reference.url} target="_blank">{reference.name}</a></strong><br />
                        {reference.description}<br />
                    </p>
                </div>
            
        })
    }
    //generate a list of <p> from a simple array list
    function simpleParagraphList(array) {
        return array.map(item => {
            return <p key={item}>{item}</p>
        })
    }

    //generate a contacts list
    function contactsList(array) {
        return array.map(contact => {
            const url = "https://phonetool.amazon.com/users/" + contact.alias
            return <div key={contact.area + contact.alias}>
                {contact.area} - <a href={url} target="_blank" title={contact.role}>{contact.fullname}</a><br />
            </div>
        })
    }

    //execute only if a solution is defined
    return props.solution && 
    <Modal
      onDismiss={() => props.setVisible(false)}
      visible={props.visible}
      size="large"
      header="AWS Solution Detail"
    >
        <section className="modal-content-main">
            <div className="modal-content-row modal-content-main-group">
                <div className="modal-content-column-narrow ">
                <div className="image-solution-logo-container">
                    <img src={getImageURL(solution.logoImage)} className="image-solution-logo" />
                </div>
                </div>
                <div className="modal-content-column">
                    <a href={solution.officialURL} target="_blank">{solution.officialURL}</a><br/>
                    <a href={solution.marketPlaceURL} target="_blank">AWS MarketPlace</a><br/>
                    <a href={solution.solutionsURL} target="_blank">AWS Solution</a><br/>
                    <a href={solution.blueprintURL} target="_blank">CSC Blueprint</a><br/>
                </div>
            </div>
            <div className="modal-content-row modal-content-main-group modal-content_centerall">
                {cylinders(solution.scaleCylinder, cylindersData)}
            </div>
            <div className="modal-content-row">
                <div className="modal-content-column modal-content-main-group">{solution.description}</div>
                <div className="modal-content-column-narrow modal-content-main-group">
                    <strong>Industries</strong>
                    {simpleParagraphList(solution.industries)}
                </div>
                <div className="modal-content-column-narrow modal-content-main-group">
                    <strong>Contacts</strong>
                    {contactsList(solution.awsContact)}
                </div>
            </div>
            <div className="modal-content-row">
                <div className="modal-content-column modal-content-main-group">
                    <h3>Related Documents</h3>
                    {solutionReferences(solution.otherDocuments)}
                    <hr />
                    <h3>Customer References</h3>
                    {solutionReferences(solution.customerReferences)} 
                    <hr />
                    <h3>Related Training</h3>
                    {solutionReferences(solution.trainingURLs)}  
                </div>
                <div className="modal-content-column-narrow modal-content-main-group">
                    {
                        solution.buyersGuideURL && 
                        <p><a href={solution.buyersGuideURL} target="_blank"><Icon name="file-open" variant="link" /> AWS Buyers Guide</a></p>
                    }
                    
                    <hr />
                    <h3>SI Partners</h3>
                    {solutionReferences(solution.consultingPartners)}  
                </div>
            </div>  
        </section>

    </Modal>

}

export default SolutionDetail;