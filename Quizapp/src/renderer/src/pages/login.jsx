import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import credentials from "../json/credentials"; // Adjust the path based on where you save the file

// src/json/credentials.jssrc/renderer/src/json/Userimages/1.jpg

import user from './../Userimages/user.jpg'
import srini from './../Userimages/Square.png'
import { WavyBackground } from "../components/background.tsx";

const credentials = [
    {
        id: "Srinivash",
        name: "Srinivash",
        pass: "//",
        std: "12-B",
        idno: "12245",
        img: user
    },
    {
        id: "Surya",
        name: "Surya CS",
        pass: "//",
        std: "CSE",
        idno: "12245",
        img: user
    },
    {
        id: "Sedhuraj",
        name: "Sedhuraj",
        pass: "//",
        std: "CSE",
        idno: "12245",
        img: user
    },
    {
        id: "//",
        name: "Srinivash-Developer",
        pass: "//",
        std: "Developer",
        idno: "#1",
        img: srini
    }
   

];

import {SERVER_IP} from '../server-config';



const Login = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoginEnabled, setIsLoginEnabled] = useState(false); // Initially false
    const [selectedOption, setSelectedOption] = useState(null); // To store selected volume or random
    const [showAccessDenied, setShowAccessDenied] = useState(false); // To control access denied notification
    const navigate = useNavigate();

    useEffect(() => {
        // Create a WebSocket connection
        const socket = new WebSocket(`ws://${SERVER_IP}:8080`);

        socket.onopen = () => {
            console.log("WebSocket Client Connected");
            // Send initial message to identify the app
            socket.send(JSON.stringify({ type: 'app', appName: 'login' }));
        };

        socket.onmessage = (event) => {
            // Handle incoming messages from the server
            const data = JSON.parse(event.data);
            console.log("Received message from server:", data);

            if (data.type === "loginStatus") {
                console.log("Login status received:", data.isEnabled);
                setIsLoginEnabled(data.isEnabled);
            } else if (data.type === "selection") {
                console.log("Quiz selection option received:", data.option);
                setSelectedOption(data.option); // Could be 1, 2, or 'random'
            }
        };

        socket.onclose = () => {
            console.log("WebSocket Client Disconnected");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Cleanup on component unmount
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);



    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Attempting to log in with ID:", id);
        console.log("Selected Option:", selectedOption); // Debug log for selectedOption

        // Check if login is enabled
       
        // Validate user credentials
        const user = credentials.find(
            (cred) => cred.id === id && cred.pass === password
        );

        if (user) {
            console.log("User authenticated successfully:", user);
            localStorage.setItem("user", JSON.stringify(user)); // Save user data in local storage

            // Navigate to the appropriate quiz based on selectedOption
            // if (selectedOption === 'தமிழ்') {
            //     console.log("Navigating to Quiz Volume 1");
            //     navigate("/quizvolume1", { state: { user } });
            // } else if (selectedOption === 'Maths') {
            //     console.log("Navigating to Quiz Volume 2");
            //     navigate("/quizvolume2", { state: { user } });
            // } 


          
             if (selectedOption === 'Physics-Public Pattern') {
                console.log("Navigating to Random Quiz");
                navigate("/phy-random", { state: { user } });
            }
            else if (selectedOption === 'Physics-volume-1') {
                console.log("Navigating to Random Quiz");
                navigate("/phy-volume-1", { state: { user } });
            }
            else if (selectedOption === 'Physics-volume-2') {
                console.log("Navigating to Random Quiz");
                navigate("/phy-volume-2", { state: { user } });
            }
            else if (selectedOption === 'Physics-Chapterwise') {
                console.log("Navigating to Random Quiz");
                navigate("/phychapterwise", { state: { user } });
            }


            else if (selectedOption === 'Tamil Public Pattern') {
                console.log("Navigating to Random Quiz");
                navigate("/tamilrandom", { state: { user } });
            }
            else if (selectedOption === 'Tamil Chapterwise') {
                console.log("Navigating to Random Quiz");
                navigate("/tamilchapterwise", { state: { user } });
            }
            else if (selectedOption === 'Tamil Full Portion') {
                console.log("Navigating to Random Quiz");
                navigate("/tamilfullportion", { state: { user } });
            }


            else if (selectedOption === 'Commerce Public Pattern') {
                console.log("Navigating to Random Quiz");
                navigate("/commercerandom", { state: { user } });
            }
            else if (selectedOption === 'Commerce Chapterwise') {
                console.log("Navigating to Random Quiz");
                navigate("/commercechapterwise", { state: { user } });
            }
            else if (selectedOption === 'Commerce Full Portion') {
                console.log("Navigating to Random Quiz");
                navigate("/commercefullportion", { state: { user } });
            }




            else if (selectedOption === '12') {
                console.log("Navigating to Random Quiz");
                navigate("/phy-random", { state: { user } });
            }
             else {
                console.log("No quiz selection available. Current selectedOption:", selectedOption);
                setError("Quiz selection is not available.");
            }
        } else {
            console.log("Invalid ID or Password entered.");
            setError("Invalid ID or Password");
        }
    };


    return (
        <div>
            <section className="login_main_container">
                <div className="wrapper">
                <WavyBackground/>
                </div>
                <div className="login_box">
                    <h1>Insight CB</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Type your ID"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Type your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="buttoncon">
                            <button type="submit" >Login</button>
                        </span>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
                {showAccessDenied && (
                    <div className="toast-notification">
                        <p>Access Denied: Login is currently disabled.</p>
                    </div>
                )}
            </section>

            <span className="mobile-view">
                <h1>Please view it on Desktop</h1>
            </span>
        </div>
    );
};

export default Login;
