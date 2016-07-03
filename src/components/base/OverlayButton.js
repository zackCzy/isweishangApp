import React,{Component,PropTypes} from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Platform
} from 'react-native';

const overlayButtonSize = 35;


class OverlayButton extends Component {
	// 构造
	  constructor(props) {
	    super(props);
	    // 初始状态
	  }
	render() {
		return (
			<View
				style={[styles.container, this.props.position ? this.props.position : styles.defaultPosition, this.props.style]}>
				<TouchableOpacity
					onPress={this.props.onPress}>
					{this.props.children}
				</TouchableOpacity>
			</View>
		)
	}
}

const statusBarHeight=Platform.OS=="ios" ? 30:10
const styles = StyleSheet.create({
	container: {
		height: overlayButtonSize,
		width: overlayButtonSize,
		position: 'absolute',
		borderRadius: overlayButtonSize / 2,
		backgroundColor: 'rgba(0,0,0,0.7)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	defaultPosition: {
		left: 7,
		top: statusBarHeight
	}
});


export default OverlayButton;
