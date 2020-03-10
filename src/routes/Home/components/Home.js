import React from "react";


import { Container, Header }  from "native-base";
import MapContainer from "./MapContainer";

import HeaderComponent from "../../../components/HeaderComponent"
import FooterComponent from "../../../components/FooterComponent";

import { Actions } from "react-native-router-flux";

import Fare from "./Fare";
import Fab from "./Fab";
import FindDriver from "./FindDriver";
const taxiLogo = require("../../../assets/img/taxi_logo_white.png");
const carMarker = require("../../../assets/img/carMarker.png");

import { Platform, StyleSheet, View, PermissionsAndroid, Text, Alert, ScrollView,SafeAreaView } from 'react-native';

 
export async function request_location_runtime_permission() {
 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'ReactNativeCode Location Permission',
        'message': 'ReactNativeCode App needs access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    }
    else {
 
      Alert.alert("Location Permission Not Granted");
 
    }
  } catch (err) {
    console.warn(err)
  }
}



class Home extends React.Component{
	
async	componentDidMount(){
  await request_location_runtime_permission();
  var rx=this;

    this.props.getCurrentLocation();
    setTimeout(function(){
			rx.props.getNearByDrivers();

		}, 1000);
    
  }
/*  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.booking.status === "confirmed" ){
        Actions.trackDriver({type: "reset"});
    }
    this.props.getCurrentLocation();
}
*/
	render(){	
    const { status } = this.props.booking;
    
		return (
        <ScrollView>
        <Container>    
        <HeaderComponent logo={taxiLogo}/>
        {(status!=='pending') &&

        <View style={{flex:1}}>   
       	{this.props.region.latitude &&
				<MapContainer region={this.props.region} 
					getInputData={this.props.getInputData}
					toggleSearchResultModal={this.props.toggleSearchResultModal}
					getAddressPredictions={this.props.getAddressPredictions}
          resultTypes={this.props.resultTypes}
          predictions={this.props.predictions}
          getSelectedAddress={this.props.getSelectedAddress}
          selectedAddress = {this.props.selectedAddress}
          carMarker= {carMarker}
          nearByDrivers={this.props.nearByDrivers}
          />
          
        }
         
        <Fab onPressAction={()=>this.props.bookCar()}/> 
           
        </View>
        ||
        <FindDriver selectedAddress = {this.props.selectedAddress}/>
      }
        <FooterComponent/> 
        
        </Container>
        
        </ScrollView>
      
		);
			

	}
}

export default Home;