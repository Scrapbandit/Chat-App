import React, { Component } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import NetInfo from "@react-native-community/netinfo"; //import package to determine if user is online or not
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";

import { View, Platform, KeyboardAvoidingView } from "react-native";

// const firebase = require('firebase');
// require('firebase/firestore');

import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCPGA5a54SYFgF3WS0WC0jRhycpGdcBT0",
  authDomain: "test-99010.firebaseapp.com",
  projectId: "test-99010",
  storageBucket: "test-99010.appspot.com",
  messagingSenderId: "587519131677",
  appId: "1:587519131677:web:516c76cdb4d5268299c6f4",
  measurementId: "G-F00Q1T1KSK",
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderInputToolbar = this.renderInputToolbar.bind(this);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      image: null,
      location: null,
      isConnected: false,
    };

    //setting up the firebase
    

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference to Firestore collection
    // this.referenceChatMessages = firebase.firestore().collection("messages");

    this.referenceMessagesUser = null;

  }

  

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
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    //Reference to load messages
    this.referenceChatMessages = firebase.firestore().collection('messages');

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }
    });

    //Authenticates user via Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        },
      });
      this.referenceMessageUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
      this.saveMessages();
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  //stop listening
  /*
  componentWillUnmount() {
    if (this.state.isConnected) {
      this.authUnsubscribe();
      //this.unsubscribe();
    }
  }
  */

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    });
  }


  // Adds messages to cloud storage
  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      location: message.location || null,
      image: message.image || null,
    });
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
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages
    });
  };

  renderBubble(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return <MapView
        style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
        region={{
          latitude: currentMessage.location.latitude,
          longitude: currentMessage.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#4E6459'
          }
        }}
      />
    )
  }

  renderCustomActions = (props) => {
    let { name } = this.props.route.params;

    const setLocationMessageLocation = (location) => {
      const newMessages = [{
        _id: uuid.v4(),
        text: 'My location',
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        createdAt: new Date(),
        user: {
          _id: this.state.user._id,
          name: name,
          avatar: this.state.user.avatar,
        },
      }]
      this.onSend(newMessages)
    }
    return <CustomActions {...props} locationFn={setLocationMessageLocation} />;
  };

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    let name = this.props.route.params.name;
    let bgColor = this.props.route.params.bgColor;

    return (
      <View style={[{ backgroundColor: bgColor }, { flex: 1 }]}>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions.bind(this)}
          onSend={this.onSend}
          user={{
            _id: this.state.user._id,
            name: name,
            avatar: this.state.user.avatar,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
