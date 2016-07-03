import React,{Component,PropTypes} from 'react';
import {
	StyleSheet,
	Image,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons.js';
import OverlayButton from './base/OverlayButton';
import { parseImgUrl } from '../utils';


class UserOverlay extends Component {
	static propTypes = {
		toLogin: PropTypes.func,
		toUser: PropTypes.func
	};
	_onPress() {
		const { user, toLogin, toUser } = this.props;
		if (user) {
			toUser();
		}
		else {
			toLogin();
		}
	}

	_loadEventFired(event){
		console.log(event);
	}
	_renderOverlayContent() {
		if (this.props.user) {
			const uri = parseImgUrl(this.props.user.profile_image_url);
			return (
				<Image
					style={styles.userImg}
					onLoadEnd={()=>this._loadEventFired()}
					source={{
						uri
					}}>
				</Image>
			)
		}

		return (
			<View style={styles.iconWrapper}>
				<Icon
					name='md-person'
					size={28}
					color='rgba(255,255,255,0.9)'
					style={styles.icon}
				/>
			</View>
		)
	}


	render() {
		return (
			<OverlayButton
				onPress={this._onPress.bind(this)}>
				{this._renderOverlayContent()}
			</OverlayButton>
		)
	}
}


const styles = StyleSheet.create({
	userImg: {
		borderWidth: 1,
		borderColor: 'rgba(241,196,15,0.9)',
		width: 35,
		height: 35,
		borderRadius: 35 / 2
	},
	iconWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 35,
		width: 35
	},
	icon: {
		flex: 1,
		textAlign: 'center'
	}
});

export default UserOverlay;
