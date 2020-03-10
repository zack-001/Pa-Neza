import { connect } from "react-redux";
import Home from "../components/Home";
import { setName } from '../modules/HomeReducer';
import {
	getCurrentLocation,
	getInputData,
	toggleSearchResultModal,
	getAddressPredictions,
	getSelectedAddress,
	bookCar,
	getNearByDrivers
} from "../modules/HomeReducer";

const mapStateToProps = (state)=>{
	return{
		region: state.HomeReducer.region,
		inputData: state.HomeReducer.inputData || {} ,
		resultTypes:state.HomeReducer.resultTypes || {},
		predictions:state.HomeReducer.predictions ||  [],
		selectedAddress:state.HomeReducer.selectedAddress || {},
		fare:state.HomeReducer.fare,
		booking:state.HomeReducer.booking || {},
		nearByDrivers:state.HomeReducer.nearByDrivers || []
	}
};
const mapActionCreators = {
	getCurrentLocation,
	getInputData,
	toggleSearchResultModal,
	getAddressPredictions,
	getSelectedAddress,
	bookCar,
	getNearByDrivers
};

export default connect(mapStateToProps, mapActionCreators)(Home);