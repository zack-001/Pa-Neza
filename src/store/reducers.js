import { combineReducers } from "redux";
import  {HomeReducer}  from "../routes/Home/modules/HomeReducer";
import {TrackDriverReducer} from "../routes/TrackDriver/module/trackDriver";

export const makeRootReducer = () => {
	return combineReducers({
		HomeReducer,
		//TrackDriverReducer
	});
}

export default makeRootReducer;