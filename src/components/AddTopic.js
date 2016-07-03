/**
 * Created by zack on 16/5/31.
 */
import  React,{Component}  from 'react';
import {
    View,
    AppRegistry,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    Platform
} from 'react-native';
const {height, width} = Dimensions.get('window');
const topHeight = Platform.OS === 'ios' ? 175 : 155;
let _animateHandlerShow;
let _animateHandlerHide;
export default class AddTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacityAnmValue: new Animated.Value(0), // init opacity 0
            bounceValue: new Animated.Value(0)
        };

    }

    hide() {
        _animateHandlerHide.start && _animateHandlerHide.start()

    }

    show() {
        _animateHandlerShow.start && _animateHandlerShow.start();
    }


    componentDidMount() {
        this.state.bounceValue.setValue(0);     // 设置一个较大的初始值
        _animateHandlerShow = Animated.spring(this.state.bounceValue, {
            toValue: topHeight,
            friction: 6,
            tension: 35
        });
        _animateHandlerHide = Animated.spring(this.state.bounceValue, {
            toValue: 0,
            friction: 10,
            tension: 35
        });

    }


    render() {
        return (
            <Animated.View style={[styles.container,{transform: [{translateY: this.state.bounceValue}]}]}>
                {this.props.children}
            </Animated.View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flex: 1,
        justifyContent: 'center',
        position: "absolute", left: 0, top: -100,
        width:width,height:100
    }
});
