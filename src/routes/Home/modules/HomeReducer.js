import update from "react-addons-update";
import constants from "./actionConstants";
import Geolocation from "react-native-geolocation-service";
import { Dimensions, PermissionsAndroid } from "react-native"
import RNGooglePlaces from "react-native-google-places";

import request from "../../../util/request";

import calculateFare from "../../../util/fareCalculator.js";


//--------------------
//Constants
//--------------------
const { 
	GET_CURRENT_LOCATION, 
	GET_INPUT,
	TOGGLE_SEARCH_RESULT,
	GET_ADDRESS_PREDICTIONS,
	GET_SELECTED_ADDRESS,
	GET_DISTANCE_MATRIX,
	GET_FARE,
	BOOK_CAR,
	GET_NEARBY_DRIVERS
 }= constants;



const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA


//--------------------
//Actions
//--------------------
export  function getCurrentLocation(){
	return(dispatch)=>{

			Geolocation.getCurrentPosition(
				(position)=>{
					dispatch({
						type:GET_CURRENT_LOCATION,
						payload:position
					});
				},
				(error)=> console.log('1' + error.message),
				{enableHighAccuracy: true, timeout: 20000, maximumAge:1000}
			);
	  	}
	 }
	 export function getInputData(payload){
		return{
			type:GET_INPUT,
			payload
		}
	}
	//toggle search result modal
	export function toggleSearchResultModal(payload){
		return{
			type:TOGGLE_SEARCH_RESULT,
			payload
		}
	}
	
	
	//GET ADRESSES FROM GOOGLE PLACE
	
	export function getAddressPredictions(){
		return(dispatch, store)=>{
			let userInput = store().HomeReducer.resultTypes.pickUp ? store().HomeReducer.inputData.pickUp : store().HomeReducer.inputData.dropOff;
			RNGooglePlaces.getAutocompletePredictions(userInput,
				{
					//westlimit=-95.039443; southlimit=16.414811; eastlimit=-95.000819; northlimit=16.449799
					locationRestriction: {
						latitudeSW: 16.414811, 
						longitudeSW: -95.039443, 
						latitudeNE: 16.449799, 
						longitudeNE: -95.000819
					}
				}
			)
			.then((results)=>
				dispatch({
					type:GET_ADDRESS_PREDICTIONS,
					payload:results
				})
			)
			.catch((error)=> console.log(error.message));
		};
	}

	//get selected address

export function getSelectedAddress(payload){
	const dummyNumbers ={
		baseFare:0.4,
		timeRate:0.14,
		distanceRate:0.97,
		surge:1
	}
	return(dispatch, store)=>{
		RNGooglePlaces.lookUpPlaceByID(payload)
		.then((results)=>{
			dispatch({
				type:GET_SELECTED_ADDRESS,
				payload:results
			})
		})
		.then(()=>{
			//Get the distance and time
			if(store().HomeReducer.selectedAddress.selectedPickUp && store().HomeReducer.selectedAddress.selectedDropOff){
				request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
				.query({
					origins:store().HomeReducer.selectedAddress.selectedPickUp.location.latitude + ',' + store().HomeReducer.selectedAddress.selectedPickUp.location.longitude,
					destinations:store().HomeReducer.selectedAddress.selectedDropOff.location.latitude + ',' + store().HomeReducer.selectedAddress.selectedDropOff.location.longitude,
					mode:"driving",
					key:"AIzaSyB66z8pFigblcyjOzxPSBWNVN3HLNJNfGc"
				})
				.finish((error, res)=>{
					dispatch({
						type:GET_DISTANCE_MATRIX,
						payload:res.body
					});
				})
			}
			setTimeout(function(){
				if(store().HomeReducer.selectedAddress.selectedPickUp && store().HomeReducer.selectedAddress.selectedDropOff){
					const fare = calculateFare(
						dummyNumbers.baseFare,
						dummyNumbers.timeRate,
						store().HomeReducer.distanceMatrix.rows[0].elements[0].duration.value,
						dummyNumbers.distanceRate,
						store().HomeReducer.distanceMatrix.rows[0].elements[0].distance.value,
						dummyNumbers.surge,
					);
					dispatch({
						type:GET_FARE,
						payload:fare
					})
				}


			},2000)

		})
		.catch((error)=> console.log(error.message));
	}
}


	/*return(dispatch, store)=>{
		RNGooglePlaces.lookUpPlaceByID(payload)
		.then((results)=>{
			dispatch({
				type:GET_SELECTED_ADDRESS,
				payload:results
			})
		}).then(()=>{
			if(store().HomeReducer.selectedAddress.selectedPickUp && store().HomeReducer.selectedAddress.selectedDropOff){
				request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
				.query({
					origins:store().HomeReducer.selectedAddress.selectedPickUp.location.latitude + ',' + store().HomeReducer.selectedAddress.selectedPickUp.location.longitude,
					destinations:store().HomeReducer.selectedAddress.selectedDropOff.location.latitude + ',' + store().HomeReducer.selectedAddress.selectedDropOff.location.longitude,
					mode:"driving",
					key:"AIzaSyB66z8pFigblcyjOzxPSBWNVN3HLNJNfGc"
				})
				.finish((error, res)=>{
					console.log(res);
					dispatch({
						type:GET_DISTANCE_MATRIX,
						payload:res.body
					});
					
				})
			}	
		}
		)

		. catch ((error)=> console.log('last catch: '+error.message))
	}
}*/
	

//BOOK CAR

export function bookCar(){
	return (dispatch, store)=>{
		const nearByDrivers = store().HomeReducer.nearByDrivers;
		const nearByDriver = nearByDrivers[Math.floor(Math.random() * nearByDrivers.length)];
		const payload = {
			data:{
				username:"karla001",
				pickUp:{
					address:store().HomeReducer.selectedAddress.selectedPickUp.address,
					name:store().HomeReducer.selectedAddress.selectedPickUp.name,
					latitude:store().HomeReducer.selectedAddress.selectedPickUp.location.latitude,
					longitude:store().HomeReducer.selectedAddress.selectedPickUp.location.longitude
				},
				dropOff:{
					address:store().HomeReducer.selectedAddress.selectedDropOff.address,
					name:store().HomeReducer.selectedAddress.selectedDropOff.name,
					latitude:store().HomeReducer.selectedAddress.selectedDropOff.location.latitude,
					longitude:store().HomeReducer.selectedAddress.selectedDropOff.location.longitude
				},
				//fare:store().HomeReducer.fare,
				status:"pending"
			},
			nearByDriver:{
				socketId:nearByDriver.socketId,
				driverId:nearByDriver.driverId,
				latitude:nearByDriver.coordinate.coordinates[1],
				longitude:nearByDriver.coordinate.coordinates[0]
			}
		};
		request.post("http://10.0.2.2:4000/api/bookings")
		.send(payload)
		.finish((error, res)=>{
			if(error){
				console.log(error)
			}else{
			dispatch({
				type:BOOK_CAR,
				payload:res.body.ops[0]
			});
		}
		})

	};
}

//get nearby drivers

export function getNearByDrivers(){
	return(dispatch, store)=>{
		request.get("http://10.0.2.2:4000/api/driverLocation")
		.query({
			latitude:store().HomeReducer.region.latitude,
			longitude:store().HomeReducer.region.longitude	
		})
		.finish((error, res)=>{
			if(res){
				dispatch({
					type:GET_NEARBY_DRIVERS,
					payload:res.body
				});
			}else{
				dispatch({
					type:GET_NEARBY_DRIVERS,
					payload:error
				});
			}
		});
	};
}


//--------------------
//Action Handlers
//--------------------

function handleGetCurrentLocation(state, action){
	return update(state, {
		region:{
			latitude:{
				$set:action.payload.coords.latitude
			},
			longitude:{
				$set:action.payload.coords.longitude
			},
			latitudeDelta:{
				$set:LATITUDE_DELTA
			},
			longitudeDelta:{
				$set:LONGITUDE_DELTA
			}
		}
	})
}


function handleGetInputDate(state, action){
	const { key, value } = action.payload;
	return update(state, {
		inputData:{
			[key]:{
				$set:value
			}
		}
	});
}

function handleToggleSearchResult(state, action){
	if(action.payload === "pickUp"){
		return update(state, {
			resultTypes:{
				pickUp:{
					$set:true,
				},
				dropOff:{
					$set:false
				}
			},
			predictions:{
				$set:{}
			}

		});
	}
	if(action.payload === "dropOff"){
		return update(state, {
			resultTypes:{
				pickUp:{
					$set:false,
				},
				dropOff:{
					$set:true
				}
			},
			predictions:{
				$set:{}
			}

		});
	}

}


function handleGetAddressPredictions(state, action){
	return update(state, {
		predictions:{
			$set:action.payload
		}
	})
}

function handleGetSelectedAddress(state, action){
	let selectedTitle = state.resultTypes.pickUp ? "selectedPickUp" : "selectedDropOff"
	return update(state, {
		selectedAddress:{
			[selectedTitle]:{
				$set:action.payload
			}		
		},
		resultTypes:{
			pickUp:{
				$set:false
			},
			dropOff:{
				$set:false
			}
		}
	})
}

function handleGetDitanceMatrix(state, action){
	return update(state, {
		distanceMatrix:{
			$set:action.payload
		}
	})
}

function handleGetFare(state, action){
	return update(state, {
		fare:{
			$set:action.payload
		}
	})
}

//handle book car

function handleBookCar(state, action){
	return update(state, {
		booking:{
			$set:action.payload
		}
	})
}


//handle get nearby drivers
function handleGetNearbyDrivers(state, action){
	return update(state, {
		nearByDrivers:{
			$set:action.payload
		}
	});
}


function handleBookingConfirmed(state, action){
    return update(state, {
        booking:{
            $set: action.payload
        }
    });

}




const ACTION_HANDLERS = {
	GET_CURRENT_LOCATION: handleGetCurrentLocation,
	GET_INPUT:handleGetInputDate,
	TOGGLE_SEARCH_RESULT:handleToggleSearchResult,
	GET_ADDRESS_PREDICTIONS:handleGetAddressPredictions,
	GET_SELECTED_ADDRESS: handleGetSelectedAddress,
	GET_DISTANCE_MATRIX: handleGetDitanceMatrix,
	GET_FARE: handleGetFare,
	BOOK_CAR: handleBookCar,
	GET_NEARBY_DRIVERS: handleGetNearbyDrivers,
	BOOKING_CONFIRMED :handleBookingConfirmed	


}
const initialState = {
	region:{},
	inputData:{},
	resultTypes:{},
	selectedAddress:{}

};

export function HomeReducer (state = initialState, action){
	const handler = ACTION_HANDLERS[action.type];

	return handler ? handler(state, action) : state;
}