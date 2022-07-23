// import React from 'react';

// import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

// export default class Chat extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { name: "" };
//       }

//   render() {
//     let name = this.props.route.params.name;
//     this.props.navigation.setOptions ({ title: name });

//     return (
//         <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Chat here</Text>
//         <Button
//           title="Go to Start"
//           onPress={() => this.props.navigation.navigate('Start')}
//         />
//       </View>
//     );
//   };
// }

import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

export class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
         },
         {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
         },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    return (
      <view style={[{ backgroundColor: color }, styles.container]}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </view>
    );
  }
}
