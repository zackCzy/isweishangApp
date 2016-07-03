import React from 'react';
import {
	Navigator,
	Platform,
	BackAndroid
} from 'react-native';
import _ from 'lodash';
import * as About from '../layouts/About';
import * as QRCode from '../layouts/QRCode';
import * as Login from '../layouts/Login';
import * as User from '../layouts/User';
import * as Index from '../layouts/Index';
import * as Message from '../layouts/Message';
import * as Topic from '../layouts/Topic';
import * as Comment from '../layouts/Comment';
import * as Publish from '../layouts/Publish';
import * as HomeComponent from '../layouts/Home';
import * as IndexComponent from '../layouts/Index';
import * as HtmlComponent from '../layouts/Html';
import * as PhotoView from '../layouts/PhotoView';
import * as BottomNav from '../layouts/BottomNav';
import * as Chat from '../layouts/Chat';
import * as Register from '../layouts/Register';
import * as CustomSceneConfigs from '../configs/sceneConfig';
import connectComponent from '../utils/connectComponent';


const Home = connectComponent(HomeComponent);
const {SceneConfigs} = Navigator;

class Router {
	constructor(navigator) {
		this.navigator = navigator;
		if (Platform.OS === 'android') {
			BackAndroid.addEventListener('hardwareBackPress', ()=> {
				const routesList = this.navigator.getCurrentRoutes();
				const currentRoute = routesList[routesList.length - 1];
				if (currentRoute.name !== 'home') {
					navigator.pop();
					return true;
				}
				return false;
			});
		}
	}


	push(props = {}, route) {
		let routesList = this.navigator.getCurrentRoutes();
		let nextIndex = routesList[routesList.length - 1].index + 1;
		route.props = props;
		route.index = nextIndex;
		route.sceneConfig = route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.customFloatFromRight;
		route.id = _.uniqueId();
		route.component = connectComponent(route.component);
		this.navigator.push(route);
	}


	pop() {
		this.navigator.pop();
	}

	toBottomNav(props){
		this.push(props, {
			component: BottomNav,
			name: 'BottomNav',
			sceneConfig: CustomSceneConfigs.customFloatFromRight
		});
	}
	toIndex(props){
		this.push(props, {
			component: Index,
			name: 'index',
			sceneConfig: CustomSceneConfigs.customFloatFromRight
		});
	}
	toAbout(props) {
		this.push(props, {
			component: About,
			name: 'about',
			sceneConfig: CustomSceneConfigs.customFloatFromBottom
		});
	}
	toRegister(props) {
		this.push(props, {
			component: Register,
			name: 'register',
			sceneConfig:Navigator.SceneConfigs.FloatFromBottomAndroid
		});
	}
	toHome(props) {
		this.push(props, {
			component: HomeComponent,
			name: 'home',
			sceneConfig: CustomSceneConfigs.customFloatFromRight
		});
	}
	toChat(props){
		this.push(props, {
			component: Chat,
			name: 'chat',
			sceneConfig: CustomSceneConfigs.customFloatFromRight
		});
	}
	toHtml(props){
		this.push(props, {
			component: HtmlComponent,
			name: 'html',
			sceneConfig: CustomSceneConfigs.customFloatFromRight
		});
	}
	toLogin(props) {
		this.push(props, {
			component: Login,
			name: 'login',
			sceneConfig: CustomSceneConfigs.customFloatFromBottom
		});
	}
	toPhoto(props,params){
		this.push(props, {
			component: PhotoView,
			name: 'photo',
			sceneConfig: CustomSceneConfigs.customFloatFromBottom,
			params:params
		});
	}

	toQRCode(props) {
		this.push(props, {
			component: QRCode,
			name: 'qrcode',
			sceneConfig: CustomSceneConfigs.customFloatFromBottom
		});
	}


	toUser(props) {
		this.push(props, {
			component: User,
			name: 'user'
		});
	}


	toMessage(props) {
		this.push(props, {
			component: Message,
			name: 'message'
		});
	}


	toTopic(props) {
		this.push(props, {
			component: Topic,
			name: 'topic'
		})
	}


	toComment(props) {
		this.push(props, {
			component: Comment,
			name: 'comment'
		});
	}


	toPublish(props) {
		this.push(props, {
			component: Publish,
			name: 'publish'
		});
	}
	toBottomPublish(props) {
		this.push(props, {
			component: Publish,
			name: 'publish',
			sceneConfig: CustomSceneConfigs.customUpSwipeJump
		});
	}


}


export default Router;
