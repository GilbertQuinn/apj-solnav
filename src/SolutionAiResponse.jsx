/* eslint-disable */
import React from "react"
import axios from 'axios';
import Modal from "@cloudscape-design/components/modal";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Textarea from "@cloudscape-design/components/textarea";
import Button from "@cloudscape-design/components/button";
import promptTemplate from "./assets/solutionprompt.js";
import ReactMarkdown from 'react-markdown';
import Spinner from "@cloudscape-design/components/spinner";
import Alert from "@cloudscape-design/components/alert";

const API_URI = import.meta.env.VITE_API_URL;

function SolutionAiResponse(props) {

    const solutions = props.solutions
    const [usecase, setUsecase] = React.useState("")
    const [airesponse, setAiresponse] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    function solutionBasicDetail() {
      return solutions.map((solution) => {
        //the reponse should be a new json object with only the name, description and official website url
        return {
          "name": solution.solutionName,
          "description": solution.officialURL,
          "officialWebsite": solution.officialURL
        }
      })
    }

    function aiPrompt() {
      //const aiPrompt = promptTemplate.promptPersona & promptTemplate.promptTask & " Customer Use Case: " & usecase & " JSon Solutions List: " & solutions;
      const aiPromptString = promptTemplate.promptPersona.concat(promptTemplate.promptTask, " Customer Use Case: ", usecase, " JSon Solutions List: ", JSON.stringify(solutionBasicDetail()));
      return aiPromptString;
    }

    const genAIPrompt = () => {

      if (usecase.length < 10) {
        setAiresponse("Please enter a valid use case.")
        return;
      }

      const prompt = aiPrompt();
      setAiresponse("Loading...")
      setLoading(true)
      
      axios.post(`${API_URI}/solutionai`, {
          prompt: prompt
        })
        .then(response => {
          setAiresponse(response.data)
          setLoading(false)
        })
        .catch(error => {
          console.error(error)
        })
    }

    return solutions && 
    <Modal
      onDismiss={() => props.closeModal(false)}
      visible={props.visible}
      size="large"
      header="Solution Advisor"
    >

        <Container
          header={
            <Header variant="h2">
              Customer Use Case
              <Alert statusIconAriaLabel="Warning" type="warning">
                This advisor uses Amazon Bedrock. Do not use customer or sensitive data for your use case. Exlude data that is not relevant to Solution guidance.<br/>
                This information is not saved anywhere and is only used to generate the AI response.
              </Alert>
            </Header>
          }
        >
          <div className="div-aimodel-row">
              <Textarea
                className="textarea-aimodal-flex"
                onChange={({ detail }) => setUsecase(detail.value)}
                value={usecase}
                autoFocus
                placeholder="Type customer use case here..."
                rows={5}
              />
              <Button iconName="gen-ai" variant="primary" onClick={genAIPrompt} disabled={usecase.length < 10}>Submit</Button>
          </div>

          <br/>

          <Header variant="h2">
            Advisor Response
          </Header>
          <hr></hr>

          {loading && <Spinner />} <ReactMarkdown>{airesponse}</ReactMarkdown>

        </Container>

    </Modal>

}

export default SolutionAiResponse;