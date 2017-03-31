# FaceRecognition

This is a face recognition login implementation using Microsoft Face API. For detailed information about the API see https://www.microsoft.com/cognitive-services/en-us/face-api.

## Features
- Register: Register a user. A username and a password are required. An image for face login can be added optionally via upload or camera. The image will be sent to Microsoft Face API but will not be stored in this application. Only metadata about the recognized face will be stored.
- Login: Login an existing user. An existing user can login with his username and either password or face (image upload or camera). The image will be sent to Microsoft Face API. If a face is detected, the image will be compared to the face which was recognized during registration.
- Update password: Update password for logged in user
- Update image: Update image for logged in user (upload or camera)

## Implementation Details

### Backend
The backend is a lightweight nodejs application. It is written in javascript and uses common frameworks such as expressjs to provide a api. When starting, the application connects to a database.
The backend application provides the following endpoints:
- (public)Register: register new user. If an image is sent in the body, the image will be sent to microsoft Face API for face detection. If a face is recognized, the faceId will be stored in the database. If no face is recognized, the user will be created without faceId. If the register process is successful, the backend will create a json web token which will be sent to the frontend. The token can be used for future requests to private api endpoints.
- (public) Login: Login existing user. If a image is sent in the body, the image will be send to microsoft Face API for face detection. If a face is recognized, the face will be compared to the face which was recognized for the given user during the register process. Login is possible via password too.
- (private) Home: This is a demo endpoint for secure endpoints. Requests will only be succesful if a valid token is sent.
- (private) updatePassword: Update the password for the current user
- (private) updateImage: Update the login image for the current user

### Frontend
The frontend is a angular4 web application. It was built with angular-cli. Angular material was used for layout.
Interesting Techniques:
- Webcam Capturing using getUserMedia
- Http Interceptor: When logged in, the access token will be added to every request. Also error handling for requests is handled very centrally as http errors will always result in a toast message.
- Observables: AuthService always broadcasts its changes via an observable. Other components subscribe to it and update their state according to it. E.g. app component updates its side menu entries when the user is logged out.

## Setup

### System requirements 

To build and run the application without trouble, please make sure these are installed:
- npm,: https://www.npmjs.com/
- nodejs: https://nodejs.org/en/
- mongodb: https://www.mongodb.com

### Configuration

This application can be configured in the file server/config.js
All parameters are required. Please make sure you enter a valid FACE_API_KEY and DATABASE in particular. 

#### DATABASE

Database URL to mongodb

#### SECRET

Database secret for password encryption

#### FACE_API_KEY

API key for Microsoft Face API communication. You can request a key here https://www.microsoft.com/cognitive-services/en-us/face-api.

#### FACE_API_HOST

BaseUrl for Microsoft Face API requests

#### FACE_API_PATH_VERIFY

Url path for Microsoft Face API endpoint verify

#### FACE_API_PATH_DETECT

Url path for Microsoft Face API endpoint detect

#### FACE_API_CONFIDENCE_TRESHOLD

When comparing faces, Microsoft Face API will respond with a parameter 'confidence'. This tells us how sure the API is that the given faces are actually identical. 

### Database

When running locally, you will need to start a mongodb. If you use the default database path (localhost:27017/faceRecognition) you will only need to start mondo using the command mongod.

### Install components

To build and run the application, several third-party libraries are needed. To install them, run npm install in the root directory of the project.

### Startup

#### Backend
First start the backend. Move to folder server and run node server.js
The backend will start on port 8081.

#### Frontend
Move back to the project root and run ng serve.
The frontend will start on port 4200.