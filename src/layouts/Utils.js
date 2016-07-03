import React,{Component,PropTypes} from 'react';
import  {
	View,
	StyleSheet,
	Text,
	StatusBar,
	AppState,
	DeviceEventEmitter
} from 'react-native';
import Toast from '../components/base/Toast';
import * as RongIm from './../services/RongIm';

//import * as codePushUtils from '../utils/codePushSync';


class Utils extends Component {
	componentDidMount() {
		const {actions} = this.props;
		actions.getReducerFromAsyncStorage(({user})=> {
			if (user && user.secret) {
				console.log("componentDidMount")
				RongIm.login(user.secret.rongToken,user.secret.loginname,user.secret.profile_image_url).then(data=>{
					actions.toast("登录成功")
					actions.getUnreadMessageCount();
				});
				DeviceEventEmitter.addListener('updateMessage', function(Event) {
					actions.getRongiMList();
					actions.updateChat(Event);
				});
			}
		});
		//codePushUtils.sync();
		AppState.addEventListener("change", (newState) => {
			if (newState === "active") {
				//codePushUtils.sync();
				this.props.user.secret && actions.getUnreadMessageCount();
			}
		});


		// if (__DEV__) {
		// 	actions.checkToken('your secretKey', ()=> {
		// 		actions.toast('登陆成功');
		// 	});
		// }
	}


	componentWillReceiveProps(nextProps) {
		if (this.props.toast.id !== nextProps.toast.id) {
			this.toast.show(nextProps.toast.text, nextProps.toast.timeout);
		}
	}


	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content"/>
				<Toast ref={ (view)=> this.toast=view }/>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0
	}
});


export const LayoutComponent = Utils;
export function mapStateToProps(state) {
	const {utils = {}, user,home} = state;
	console.log(home)
	return {
		...utils,
		user,
	}
}
