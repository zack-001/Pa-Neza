import React from "react";
import { Text } from "react-native";
import { Footer, FooterTab, Button, Container} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./FooterComponentStyles";


export const FooterComponent =  ({logo})=>{

	//tab bar items
	const tabs = [{
		title:"MotoTaxi",
		subTitle:"",
		icon:"car"
	},
	{
		title:"Promociones",
		subTitle:"",
		icon:"car"
	},
	{
		title:"Sobre Nosotros",
		subTitle:"",
		icon:"car"
	}];

	return (
		<Footer>
			<FooterTab style={styles.footerContainer} >

				{
					tabs.map((obj, index)=>{
						return (
							<Button key={index}>
								<Icon size={20} name={obj.icon} color={(index === 0) ? "#FF5E3A" : "grey"} />
								<Text style={{fontSize:12, color:(index === 0) ? "#FF5E3A" : "grey"}}>{obj.title}</Text>
								<Text style={styles.subText}>{obj.subTitle}</Text>
							</Button>

						)
					})
				}

			</FooterTab>
		</Footer>

	);
}

export default FooterComponent;