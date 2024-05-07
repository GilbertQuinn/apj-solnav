/* eslint-disable */
import React from "react"
import axios from 'axios';
import Cookies from 'js-cookie';

import Modal from "@cloudscape-design/components/modal";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Alert from "@cloudscape-design/components/alert";


const API_URI = import.meta.env.VITE_API_URL;

function LoginModal(props) {
    
    const [username, setUserName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loginError, setLoginError] = React.useState("")

    //Handle Submit Event
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError('')

        const loginData = {
            username: username,
            password: password
        }

        try {
            const response = await axios.post(`${API_URI}/auth/login`, loginData);
            const token = response.data.token;
            Cookies.set('jwt', token, { expires: 7, secure: true, sameSite: 'strict' });
            console.log('Logged in Succesfully');
            props.activateAdminMode()
            props.closeModal(false)
        } catch (error) {
            console.error('Update error:', error);
            setLoginError('Failed to login', error)
        }
    };

    const valid = () => {
        return (username.length > 3) && (password.length > 3)
    }

    return <Modal
      onDismiss={() => props.closeModal(false)}
      visible={props.visible}
      size="large"
      header="Admin Login"
    >

    <form onSubmit={e => e.preventDefault()}>
        <Form
            actions={
            <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary" onClick={handleSubmit} disabled={!valid()}>Submit</Button>
            </SpaceBetween>
            }
        >

            <FormField label="Username">
                <Input required type="text" name="username" value={username} onChange={({ detail }) => setUserName(detail.value)}/>
            </FormField>

            <FormField label="Password">
                <Input required type="password" name="password" value={password} onChange={({ detail }) => setPassword(detail.value)}/>
            </FormField>

            <br/>

            {loginError != "" && <Alert
                statusIconAriaLabel="Error"
                type="error"
                header={loginError}
                >
            </Alert>}

        </Form>
    </form>

    </Modal>

}

export default LoginModal;