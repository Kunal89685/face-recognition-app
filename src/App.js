import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
const uuid = require('uuid');

function App() {
    const [image, setImage] = useState('');
    const [localImagePreview, setLocalImagePreview] = useState(null);
    const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image');
    const [visitorName, setVisitorName] = useState('placeholder.jpg');
    const [isAuth, setAuth] = useState(false);
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalImagePreview(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    function sendImage(e) {
        e.preventDefault();
        setVisitorName(image.name);
        const visitorImageName = uuid.v4();
        fetch(`"Give the Bucket Address"/${visitorImageName}.jpeg`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'image/jpeg'
            },
            body: image
        }).then(async () => {
            const response = await authenticate(visitorImageName);
            if (response.Message === 'Success') {
                setAuth(true);
                setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to Work`)
            } else {
                setAuth(false);
                setUploadResultMessage('Authentication Failed: Person not in database')
            }

        }).catch(error => {
            setAuth(false);
            setUploadResultMessage('There is an error during the Authentication process')
            console.error(error);
        })

    }

    async function authenticate(visitorImageName) {
        const requestUrl = '"Give the Bucket Address"/${visitorImageName}.jpeg?' + new URLSearchParams({
            objectKey: `${visitorImageName}.jpeg`
        })
        return await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        }).then(response => response.json())
            .then((data) => {
                return data;

            }).catch(error => console.error(error));
    }

    return (
        <div className="App">
            <h2>Object Recognition System</h2>
            <form onSubmit={sendImage}>
                <input type="file" name="image" onChange={handleImageChange} />
                <button type="submit">Upload</button>
            </form>
            <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
            <img src={localImagePreview || require(`./visitors/${visitorName}`)} alt="Visitor" height={250} width={250} />
        </div>
    );
}

export default App;
