import React,{Component,PropTypes} from 'react';

import {
	Navigator,
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	DeviceEventEmitter,
	NativeModules
} from 'react-native';
import * as UtilsComponent from './Utils';
import Router from '../configs/Router';
import connectComponent from '../utils/connectComponent';
import config from '../configs';
const Utils = connectComponent(UtilsComponent);
import * as BottomNav from './BottomNav';
import * as Test from './Test';
const { height, width } = Dimensions.get('window');
import {getToken,setToken} from '../services/token';
const initialRoute = {
	name: 'BottomNav',
	index: 0,
	component: connectComponent(BottomNav),
	id: 0
};


class Navigation extends Component {
	constructor(props) {
		super(props);
		this.ids = [];
	}
	handleReceive(obj){
		console.log(obj);
	}
	componentDidMount() {
		//DeviceEventEmitter.addListener('push', this.handleReceive.bind(this));
		NativeModules.MyIntentModule.getDataFromIntent(
			(successMsg) =>{
				alert(successMsg)
			},
			(erroMsg) => {alert(erroMsg)}
		);
		this.navigator.navigationContext.addListener('didfocus', e => {
			const { index, id } = e.data.route;
			const haveFocused = this.ids.indexOf(id) > -1;
			this[index] && this[index] && this[index].getWrappedInstance().componentDidFocus && this[index].getWrappedInstance().componentDidFocus(haveFocused);
			!haveFocused && this.ids.push(id);
		});
	}


	renderScene({ component, name, props, id, index }, navigator) {
		this.router = this.router || new Router(navigator);
		if (component) {
			return React.createElement(component, {
				...props,
				ref: view => this[index] = view,
				router: this.router,
				route: {
					name,
					id,
					index
				}
			});
		}
	}


	configureScene(route) {
		if (route.sceneConfig) {
			return route.sceneConfig
		}
		return Navigator.SceneConfigs.FloatFromRight
	}


	render() {
		return (
			<Image
				source={require('../images/bg1.jpg')}
				style={styles.bg}>
				<Navigator
					ref={view => this.navigator=view}
					initialRoute={initialRoute}
					configureScene={this.configureScene.bind(this)}
					renderScene={this.renderScene.bind(this)}/>
				<Utils/>
			</Image>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	flexCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bg: {
		flex: 1,
		height,
		width,
		backgroundColor: 'transparent'
	}
});


export default Navigation;
