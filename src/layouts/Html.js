/**
 * Created by zack on 16/5/28.
 */
import React,{Component,PropTypes} from 'react';
import {
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Text,WebView
} from 'react-native';
import Header from '../components/Header';
//import WebView from '../components/MyWebView,android';

const HEADER = '#3b5998';
const BGWASH = 'rgba(255,255,255,0.8)';
const DISABLED_WASH = 'rgba(255,255,255,0.25)';


const TEXT_INPUT_REF = 'urlInput';
const WEBVIEW_REF = 'webview';
const DEFAULT_URL = 'https://m.facebook.com';

export default class Html extends Component {

	// 构造
	constructor(props) {
		super(props);
		this.state={
			title:"返回"
		};
	}

	getInitialState() {
		return {
			url: DEFAULT_URL,
			status: 'No Page Loaded',
			backButtonEnabled: false,
			forwardButtonEnabled: false,
			loading: true,
			scalesPageToFit: true,
		};
	}

	render() {
		const {router} =this.props;
		return (
			<View style={[styles.container]}>
				<Header
					text={this.state.title}
					onPress={
							()=> {
								router.pop();
							}
					}
				/>
				<WebView
					ref={WEBVIEW_REF}
					automaticallyAdjustContentInsets={false}
					style={styles.webView}
					source={{uri: 'http://192.168.1.102:3000'}}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					decelerationRate="normal"
					onNavigationStateChange={this.onNavigationStateChange}
					onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
					startInLoadingState={true}
					scalesPageToFit={this.state.scalesPageToFit}
				/>
			</View>

		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: HEADER,
	},
	addressBarRow: {
		flexDirection: 'row',
		padding: 8,
	},
	webView: {
		backgroundColor: BGWASH,
		height: 350,
	},
	addressBarTextInput: {
		backgroundColor: BGWASH,
		borderColor: 'transparent',
		borderRadius: 3,
		borderWidth: 1,
		height: 24,
		paddingLeft: 10,
		paddingTop: 3,
		paddingBottom: 3,
		flex: 1,
		fontSize: 14,
	},
	navButton: {
		width: 20,
		padding: 3,
		marginRight: 3,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: BGWASH,
		borderColor: 'transparent',
		borderRadius: 3,
	},
	disabledButton: {
		width: 20,
		padding: 3,
		marginRight: 3,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: DISABLED_WASH,
		borderColor: 'transparent',
		borderRadius: 3,
	},
	goButton: {
		height: 24,
		padding: 3,
		marginLeft: 8,
		alignItems: 'center',
		backgroundColor: BGWASH,
		borderColor: 'transparent',
		borderRadius: 3,
		alignSelf: 'stretch',
	},
	statusBar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 5,
		height: 22,
	},
	statusBarText: {
		color: 'white',
		fontSize: 13,
	},
	spinner: {
		width: 20,
		marginRight: 6,
	},
	buttons: {
		flexDirection: 'row',
		height: 30,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	button: {
		flex: 0.5,
		width: 0,
		margin: 5,
		borderColor: 'gray',
		borderWidth: 1,
		backgroundColor: 'gray',
	},
});

export const LayoutComponent = Html;
export function mapStateToProps(state) {
	return {};
}
