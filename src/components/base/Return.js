import React,{Component,PropTypes} from 'react';

import{
	StyleSheet,
	Dimensions,
	View
} from 'react-native';
import OverlayButton from './OverlayButton';
import Icon from 'react-native-vector-icons/Ionicons';


const returnSize = 45;


class Return extends Component {
	// 构造
	  constructor(props) {
	    super(props);
	    // 初始状态
	  }
	_onPress() {
		this.props.router && this.props.router.pop && this.props.router.pop()
	}


	render() {
		return (
			<OverlayButton
				style={this.props.style}
				onPress={this._onPress.bind(this)}
				position={this.props.position}
			>
				<View style={styles.iconWrapper}>
					<Icon
						name='md-arrow-back'
						size={ 30 }
						color='rgba(255,255,255,1)'
						style={ styles.returnIcon }/>
				</View>
			</OverlayButton>
		)
	}
}


const styles = StyleSheet.create({
	returnIcon: {
		flex: 1,
		textAlign: 'center'
	},
	iconWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: returnSize,
		width: returnSize
	}
});


export default Return;
