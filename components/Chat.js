import React , { Component } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
//import package to determine if user is online or not
import NetInfo from "@react-native-community/netinfo";
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View, Platform, KeyboardAvoidingView
} from "react-native";


const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
    };
  
   //setting up the firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCYhM7ZWoVZLLUD5xzpcepyID3B5w1sfuE",
    authDomain: "test-8b82a.firebaseapp.com",
    databaseURL: "https://test-8b82a.firebaseio.com",
    projectId: "test-8b82a",
    storageBucket: "test-8b82a.appspot.com",
    messagingSenderId: "202131758796"
  };
  
  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }

    // Reference to Firestore collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
    this.setState({ 
      messages,
   });
  };

  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (e) {
      console.log(e.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (e) {
      console.log(e.messages);
    }
  };
  

  componentDidMount() {

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });

        // Reference to load messages from Firebase
        this.referenceChatMessages = firebase
          .firestore()
          .collection('messages');

      // Authenticate user anonymously
      this.authUnsubscribe = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (!user) {
          firebase.auth().signInAnonymously();
        }    

    this.setState({
      uid: user.uid,
      messages: [],
      user: {
        _id: user.uid,
        name: name,
      },
    });
    this.unsubscribe = this.referenceChatMessages
    .orderBy('createdAt')
    .onSnapshot(this.onCollectionUpdate);
});

} else {
  this.setState({
    isConnected: false,
  });
  this.getMessages();
}
});
}
componentWillUnmount() {
  if (this.isConnected) {
    this.unsubscribe();
    this.authUnsubscribe();
  }
}

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // Save messages locally with Async Storage
        this.saveMessages();
        // Call addMessage with last message in message state
        if (this.state.isConnected === true) {
          this.addMessages(this.state.messages[0]);
        }
      }
    );
  }

  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          },
          left: {
            backgroundColor: "white",
          },
        }}
      />
    );
  }

  render() {
    let color = this.props.route.params.color;
    // Set default background color if no color was selected
    if (color === '') {
      color = 'beige';
    }
    
    return (
       <View style={[{ backgroundColor: color }, { flex: 1 }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: this.state.user._id, name: this.state.user.name }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

// import React from "react";
// import { GiftedChat } from "react-native-gifted-chat";
// import {
//   View,
//   Text,
//   Button,
//   TextInput,
//   StyleSheet,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";



// export default class Chat extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       messages: [],
//     };
//   }

//   componentDidMount() {
//     this.setState({
//       messages: [
//         {
//           _id: 1,
//           text: 'Hello developer',
//           createdAt: new Date(),
//           user: {
//             _id: 2,
//             name: 'React Native',
//             avatar: 'https://placeimg.com/140/140/any',
//           },
//          },
//          {
//           _id: 2,
//           text: 'This is a system message',
//           createdAt: new Date(),
//           system: true,
//          },
//       ],
//     });
//   }

//   onSend(messages = []) {
//     this.setState((previousState) => ({
//       messages: GiftedChat.append(previousState.messages, messages),
//     }));
//   }

//   renderBubble(props) {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             backgroundColor: '#000'
//           }
//         }}
//       />
//     )
//   }

//   render() {
//     // let name = this.props.route.params.name;
//     // this.props.navigation.setOptions({ title: name });

//     return (
//        <View>
//         <GiftedChat
//           renderBubble={this.renderBubble.bind(this)}
//           messages={this.state.messages}
//           onSend={(messages) => this.onSend(messages)}
//           user={{
//             _id: 1,
//           }}
//         />
//         {Platform.OS === "android" ? (
//           <KeyboardAvoidingView behavior="height" />
//         ) : null}
//       </View>
//     );
//   }
// }
