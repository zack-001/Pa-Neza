
//This is the one
import React,  { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';



import Root from "./src/main";
export default class App extends Component {
  render(){
    return (
        <View style={styles.container}>
        <Root {...this.props}/>
      </View>
    );
  
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});



