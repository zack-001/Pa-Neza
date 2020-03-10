import { StyleSheet, Dimensions } from "react-native";
var width = Dimensions.get("window").width; //full width
const styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    
    inputWrapper:{
        top:0,
        position:"absolute",
        backgroundColor:"#fff",
        width:width
    },
    inputSearch:{
        backgroundColor:"#fff"
    }
};

export default styles;