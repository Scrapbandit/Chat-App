import React, { Component } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import NetInfo from "@react-native-community/netinfo";//import package to determine if user is online or not
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";

import { View, Platform, KeyboardAvoidingView } from "react-native";

// const firebase = require('firebase');
// require('firebase/firestore');

import firebase from "firebase";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
        image: null,
        location: null,
        loggedInText: 'Waiting...'
    };

    
    //setting up the firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDCPGA5a54SYFgF3WS0WC0jRhycpGdcBT0",
      authDomain: "test-99010.firebaseapp.com",
      projectId: "test-99010",
      storageBucket: "test-99010.appspot.com",
      messagingSenderId: "587519131677",
      appId: "1:587519131677:web:516c76cdb4d5268299c6f4",
      measurementId: "G-F00Q1T1KSK",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference to Firestore collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
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
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (e) {
      console.log(e.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
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
          .collection("messages");

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
              .orderBy("createdAt")
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

  // stop listening to auth and collection changes
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

  // Adds messages to cloud storage
  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
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
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "white",
          },
        }}
      />
    );
  }

   renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };


  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    let color = this.props.route.params.color;
    // Set default background color if no color was selected
    const { backgroundColor } = this.props.route.params;

    return (
      <View style={[{ backgroundColor: backgroundColor }, { flex: 1 }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          renderActions={this.renderCustomActions}
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
