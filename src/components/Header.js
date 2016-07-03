/**
 * Created by zack on 16/5/27.
 */
import React,{Component,PropTypes} from 'react';

import {
	View,
} from 'react-native';

import Nav from './Nav';
import UserOverlay from './UserOverlay';

export default class Header extends Component {
	// 构造
	constructor(props) {
		super(props);
	}

	render() {
		const {user,router,text,onPress,Left,Right}=this.props;
		const navs = {
			Center: {
				text: text,
				onPress: onPress
			}
		}
		navs['Left']=Left;
		navs['Right']=Right;
		let UserLeft;
		if(user){
			UserLeft=<UserOverlay user={user.secret} toLogin={() => router.toLogin() }
								  toUser={() => router.toUser({
							 	userName: user.publicInfo.loginname
							 })}/>
		}
		return (
			<View >
				<Nav navs={navs}></Nav>
				{UserLeft}
			</View>
		)
	}
}
