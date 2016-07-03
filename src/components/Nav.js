import React,{Component,PropTypes} from 'react';

import  {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Platform
} from 'react-native';


const {height, width} = Dimensions.get('window');


class Nav extends Component {
	// 构造
	  constructor(props) {
	    super(props);
	  }
	_renderNavContent() {
		let navs = this.props.navs || {};

		return ['Left', 'Center', 'Right'].map((position)=> {
			let nav = navs[position];
			if (nav) {
				return (
					<TouchableOpacity
						key={position}
						onPress={nav.onPress}
						style={{flex: position=='Center'?2:1}}>
						<Text style={[styles.navItem,styles['nav'+position]]}>
							{nav.text}
						</Text>
					</TouchableOpacity>
				)
			}
			return (
				<Text key={position} style={[styles.navItem,styles['nav'+position]]}/>
			)
		})
	}

	render() {
		return (
			<View
				ref={view=>this.nav=view}
				style={[styles.nav,this.props.style]}
			>
				{this._renderNavContent()}
			</View>
		)
	}
}


const navHeight = 55;
const statusBarHeight = Platform.OS === 'ios' ? 20 : 0;


const styles = StyleSheet.create({
	nav: {
		height: navHeight + statusBarHeight,
		width: width,
		borderBottomColor: 'rgba(0,0,0,0.03)',
		backgroundColor: 'rgba(229,50,101,1)',
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: statusBarHeight,
		paddingLeft: 15,
		paddingRight: 15,
		shadowColor:"rgba(0,0,0,1)",
		shadowOffset:{h:10,w:10}
	},
	navItem: {
		color: 'rgba(255,255,255,0.7)',
		fontSize: 16
	},
	navLeft: {
		textAlign: 'left',
		flex: 1
	},
	navRight: {
		textAlign: 'right',
		flex: 1
	},
	navCenter: {
		textAlign: 'center',
		color: 'rgba(255,255,255,0.9)',
		fontSize:20,
		flex: 2
	}
});

Nav.navHeight = navHeight;

export default Nav;
