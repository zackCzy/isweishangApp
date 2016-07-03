/**
 * Created by zack on 16/5/27.
 */
import React,{Component,PropTypes} from 'react';

import React,{
	View,
	StyleSheet,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons.js';
import TabNavigator from 'react-native-tab-navigator';
import * as Index from './../layouts/Index';
import * as Message from './../layouts/Message';
import * as Home from './../layouts/Home';
import connectComponent from '../utils/connectComponent';
//badgeText="1"
export default class Footer extends Component {
	// 构造
	constructor(props) {
		super(props);
		// 初始状态
		this.state = {
			selectedTab: "Index",
			tabBarShow: true
		};
	}

	_renderTabItem(img, selectedImg, tag, childView) {
		return (
			<TabNavigator.Item
				selected={this.state.selectedTab === tag}
				renderIcon={() =>img}
				title={tag}
				renderSelectedIcon={() => selectedImg}
				onPress={() => {
					this.setState({ selectedTab: tag });
				}}>
				{childView}
			</TabNavigator.Item>
		);
	}

	_createChildView1(tag) {
		let renderView;
		switch (tag) {
			case '发现':
				renderView =connectComponent(Home);
				break;
			case '爱微商':
				renderView = connectComponent(Index);
				break;
			case '消息':
				renderView = connectComponent(Message);
				break;
			default:
				break;
		}
		console.log(renderView)
		return {};
		return renderView
	}

	render() {
		const {router} =this.props;
		const _me=this;
		return (
			<TabNavigator style={{flex:1}} hidesTabTouch={true} tabBarStyle={styles.tab}>
				{this._renderTabItem.call(_me,<Icon
					name='home'
					size={28}
					color='rgba(231,65,69,0.9)'
					style={styles.icon}/>, <Icon
					name='home'
					size={28}
					color='rgba(231,65,69,0.9)'
					style={styles.icon}/>, '爱微商', this._createChildView1('爱微商'))}

				{this._renderTabItem.call(_me,<Icon
					name='ios-location-outline'
					size={28}
					color='rgba(231,65,69,0.9)'
					style={styles.icon}/>, <Icon
					name='ios-location'
					size={28}
					color='rgba(231,65,69,0.9)'
					style={styles.icon}/>, '发现', this._createChildView1('发现'))}
				{this._renderTabItem.call(_me,<Icon
					name='chatboxes'
					size={28}
					color='rgba(231,65,69,0.9)'
					style={styles.icon}/>, <Icon
					name='chatboxes'
					size={28}
					color='rgba(231,65,69,0.9)'
					style={styles.icon}/>, '消息', this._createChildView1('消息'))}
			</TabNavigator>
		)
	}
};

const styles = StyleSheet.create({
	tab: {
		height: 55,
		backgroundColor: '#fff',
		alignItems: 'center'
	}
});

