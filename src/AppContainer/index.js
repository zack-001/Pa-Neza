import React from "react";

import PropTypes from 'prop-types';
import { Router } from "react-native-router-flux";

import scenes from "../routes/scenes";

import { Provider } from "react-redux";

class AppContainer extends React.Component {
	static propTypes = {
    store: PropTypes.object.isRequired
  }
	render(){

    return (
      <Provider store={this.props.store}>
        <Router scenes={scenes}/>
      </Provider>
		
	);
	} 
	
}
//AppContainer.



export default AppContainer;