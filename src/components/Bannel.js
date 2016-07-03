// es6
import React,{
	AppRegistry,
	View,
	Text,
	StyleSheet,
	Image,
	Component,
	Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper';
const {winth,height} =Dimensions.get('window');
const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#ccc"
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	slide1: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#9DD6EB',
	},
	slide2: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#97CAE5',
	},
	slide3: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#92BBD9',
	},
	text: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold',
	},
	image: {
		flex: 1,
	}
})

class Bannel extends Component {
	constructor(props) {
		super(props);
		this.state={};
	};

	_renderImage(item) {
		return (
			<View style={styles.slide} title={<Text numberOfLines={1}>{item.sub}</Text>}>
				<Image style={styles.image}
					   source={{uri:item.url}}/>
			</View>
		)
	}


	render() {
		let b = [];
		let _self = this;
		let _bannelData = this.props['bannelData']||[];
		_bannelData.forEach(function (item) {
			b.push(_self._renderImage(item));
		});
		return (
			<View style={styles.wrapper}>
				<Swiper style={styles.wrapper} height={height*0.3}
						onMomentumScrollEnd={function(e, state, context){console.log('index:', state.index)}}
						dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 5, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
						activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
						paginationStyle={{
            bottom: -23, left: null, right: 10,
          }} loop={true}>
					{b}
				</Swiper>


			</View>
		)
	};
}
export default Bannel;
