import React from 'react';
import styles from '../Login/Login.module.css';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router";

function Login({ setToken }) {

    const navigate = useNavigate();

    return (
        <div className= {styles.loginDiv}>
            <div>
                <h1 className= {styles.heading}>Sign into</h1>
            </div>
            <div>
                <h1 className= {styles.appTitle}>BudgetMe</h1>
            </div>
            <div className= {styles.loginPromptDiv}>
                <GoogleLogin onSuccess={(credentialResponse) => {
                    const decodedUser = jwtDecode(credentialResponse.credential)
                    
                    const data = { email: decodedUser.email, name: decodedUser.name }

                    axios.post("http://localhost:3001/auth", data).then((response) => {
                        if (response.data.error) {
                            alert(response.data.error);
                        } else {
                            const expiryDate = new Date(9999, 0, 1).toUTCString();
                            document.cookie = `accessToken=${response.data}; expires=${expiryDate}; path=/`;
                            
                            setToken(response.data);
                            navigate("/projects", { replace: true })
                        }
                    });
                }}
                onError={() => console.log("Login failed")} 
                auto_select={true}
                shape= "pill"
                theme= "filled_white"/>
            </div>
        </div>
    )
}

export default Login;