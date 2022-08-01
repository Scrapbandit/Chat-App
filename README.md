
# React Native Mobile Chat App

To build a chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.
```
"A fast and easiest way to connect with your friends with options to share images, pictures and their location."
```

### User Stories

* As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
friends and family.
* As a user, I want to be able to send messages to my friends and family members to exchange
the latest news.
* As a user, I want to send images to my friends to show them what I’m currently doing.
* As a user, I want to share my location with my friends to show them where I am.
* As a user, I want to be able to read my messages offline so I can reread conversations at any
time.
* As a user with a visual impairment, I want to use a chat app that is compatible with a screen
reader so that I can engage with a chat interface.


### Technical Requirements

* The app must be written in React Native.
* The app must be developed using Expo.
* The app must be styled according to the given screen design.
* Chat conversations must be stored in Google Firestore Database.
* The app must authenticate users anonymously via Google Firebase authentication.
* Chat conversations must be stored locally.
* The app must let users pick and send images from the phone’s image library.
* The app must let users take pictures with the device’s camera app, and send them.
* The app must store images in Firebase Cloud Storage.
* The app must be able to read the user’s location data.
* Location data must be sent via the chat in a map view.
* The chat interface and functionality must be created using the Gifted Chat library.
* The app’s codebase must contain comments.

### Design Specifications

* Vertical and horizontal spacing: evenly distributed
* App title: font size 45, font weight 600, font color #FFFFFF
Page 3
* “Your name”: font size 16, font weight 300, font color #757083, 50% opacity
* “Choose background color”: font size 16, font weight 300, font color #757083, 100% opacity
* Color options HEX codes: #090C08; #474056; #8A95A5; #B9C6AE
* Start chatting button: font size 16, font weight 600, font color #FFFFFF, button color #757083
* Assets available here


#### Install prerequisites

Install Expo - (https://expo.dev/): 
```
npm install expo-cli -g
```

 * Node.js and npm
 * Android Studio or Xcode for iOS
 * Expo / Expo Go

### Getting started

* install all the dependencies: ```npm i```
* start the app: ```expo start``` or ```npm start```
* Launch app on smartphone: scan QR code in Expo GUI
* Launch app on emulator: Press "Run on Android device/emulator" or "Run on iOS emulator" or "run in    web browser" in Expo GUI

### Install database

Create Google Firebase/Firestore account for data storage.
[Firebase documentation](https://firebase.google.com/docs/web/setup)

1. Sign into https://firebase.google.com/ to get started

2. Click on "create a project" and follow the steps. Start in test mode then start a collection, ("Auto-ID" to generate a random Document ID).

3. Install Firestore via Firebase: ```npm install firebase```

4. Create a new directory "config" and add a new file "firebase.js" to it. 

5. Back in the Firebase project in the browser, open up "Settings", then "General" tab. Under the section "Your apps", link Firebase to app by clicking the tag icon.

6. After connecting, it will generate configurations for different platforms. Here, click "Firestore for Web" and then copy the contents of the config object info to config/firebaseConfig.dist.js file. Initialize the App by adding ```import firebase from firebase``` at the top of the file firebase.js and initialize the app there like so: ```const firebaseApp = initializeApp(firebaseConfig)```

7. Change the name in the reference to the Firestore collection in components/chat.js file from currently "messages" to the name choosen for the collection.