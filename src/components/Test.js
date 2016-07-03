/**
 * Created by zack on 16/5/25.
 */
let React = require('react-native');
let Carousel = require('react-native-looped-carousel');
let Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
let {
	AppRegistry,
	StyleSheet,
	Text,
	View
	} = React;

let Test = React.createClass({
	getInitialState: function() {
		return {
			size: {width: width, height: height}
		};
	},
	_onLayoutDidChange: function(e) {
		var layout = e.nativeEvent.layout;
		this.setState({size: {width: layout.width, height: 100}});
	},
	render: function() {
		return (
			<View style={{flex: 1}} onLayout={this._onLayoutDidChange}>
				<Carousel delay={1000} style={this.state.size}>
					<View style={[{backgroundColor:'#BADA55'}, this.state.size]}/>
					<View style={[{backgroundColor:'red'}, this.state.size]}/>
					<View style={[{backgroundColor:'blue'}, this.state.size]}/>
				</Carousel>
			</View>
		);
	}
});

export default Test;
