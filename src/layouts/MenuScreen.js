/**
 * Created by zack on 16/6/5.
 */
'use strict';

import React,{Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    Navigator,
    ListView,
    Alert,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    LayoutAnimation,
    Animated,
    } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class MenuScreen extends Component {
    constructor(props) {
        super(props);
        this.state={
            loaded:false,
            anim: new Animated.Value(0),
            anim_rotateY: new Animated.Value(0),
            anim_translateX:new Animated.Value(width),
            transform:[],
            isMenuOpen:false,
        }
    }
    componentWillMount(){
        //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    }
    componentDidMount(){
        this.setState({
            loaded:true
        })
    }
    onpressShowmethemenu(){
    }
    showMenu(){
        if(this.state.isMenuOpen){
            this.setState({isMenuOpen:false});
            Animated.parallel([
                Animated.timing(
                    this.state.anim_translateX,{
                        toValue:width
                    }),
                Animated.timing(
                    this.state.anim_rotateY,{
                        toValue:0
                    }),
            ]).start();
        }
        else {
            this.setState({isMenuOpen:true});
            Animated.parallel([
                Animated.timing(
                    this.state.anim_translateX,{
                        toValue:width*1.24
                    }),
                Animated.timing(
                    this.state.anim_rotateY,{
                        toValue:1
                    }),
            ]).start();
        }
    }
    closeMenu(){
        this.setState({isMenuOpen:false});
        Animated.parallel([
            Animated.timing(
                this.state.anim_translateX,{
                    toValue:width
                }),
            Animated.timing(
                this.state.anim_rotateY,{
                    toValue:0
                }),
        ]).start();
    }
    render(){
        return(
            <Image style={[styles.container,{resizeMode:'cover'}]} source={{uri:'https://s-media-cache-ak0.pinimg.com/236x/24/f9/bc/24f9bcf5734dad1ce17be856d6e16719.jpg'}}>
                <View style={{position:'absolute',width:120,right:0,top:120,justifyContent:'center',backgroundColor:'transparent'}}>
                    <Text style={[styles.text,styles.menutext,styles.red]}>Home</Text>
                    <Text style={[styles.text,styles.menutext]}>Features</Text>
                    <Text style={[styles.text,styles.menutext]}>Gallery</Text>
                    <Text style={[styles.text,styles.menutext]}>Profile</Text>
                    <Text style={[styles.text,styles.menutext]}>Pages</Text>
                    <Text style={[styles.text,styles.menutext]}>Contact</Text>
                    <Text style={[styles.text,styles.menutext]}>Pages</Text>
                    <TouchableOpacity onPress={this.closeMenu.bind(this)}>
                        <Text style={[styles.text,styles.menutext]}>Close</Text>
                    </TouchableOpacity>
                </View>

                <Animated.View ref='content' style={[styles.content,{width:width,backgroundColor:'gray',flex:1,alignItems:'center',
                        transform:[{ perspective: 850},
                                   { translateX: this.state.anim_translateX.interpolate({
                                                     inputRange: [0, width],
                                                     outputRange: [width, 0],
                                   })},
                                   { rotateY: this.state.anim_rotateY.interpolate({
                                                     inputRange: [0, 1],
                                                     outputRange: ['0deg', '60deg'],
                                   })},
                                  ]
                        }]}>
                    <Text style={{top:100,color:'white',backgroundColor:'gray',fontSize:20}}>
                        Image style=width:width,height:height
                    </Text>
                    <TouchableOpacity onPress={this.showMenu.bind(this)}>
                        <View style={{width:100,height:40,top:200,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:20,color:'white'}}>Menu</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Image>
        )

    }
}
const styles = StyleSheet.create({
    text:{color:'#E0E0E0'},gray:{color:'gray'},green:{color:'green'},red:{color:'red'},
    menutext:{fontSize:20,padding:10},
    container:{width:width,height:height,flex:1,justifyContent:'center',alignItems:'center'},
    menu:{width:width,height:height,flex:1,position:'absolute',left:0,top:0,backgroundColor:'#ff00ff'},
    menulist:{width:200,position:'absolute',right:0,top:100},
})
export const LayoutComponent = MenuScreen;

