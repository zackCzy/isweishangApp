import React,{Component,PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableHighlight,
    Dimensions,
    PixelRatio,
    TouchableOpacity
} from 'react-native';
import { parseImgUrl,getImgSize } from '../utils';
import Icon from 'react-native-vector-icons/Ionicons.js';
import Lightbox from 'react-native-lightbox';
import Carousel from 'react-native-looped-carousel';
import ResponsiveImage from 'react-native-responsive-image';
import ImageZoom from 'react-native-image-zoom';
import { Button } from 'react-native-uikit';
import Swiper from 'react-native-swiper';
const spacing = 2;
const { width ,height} = Dimensions.get('window');

import {
    LazyloadScrollView,
    LazyloadView,
    LazyloadImage,
    LazyloadListView
} from 'react-native-lazyload';


class TopicRow extends Component {
    static propTypes = {
        topic: PropTypes.object,
        footer: PropTypes.node,
        onPress: PropTypes.func,
        toComment: PropTypes.func,
        more: PropTypes.func
    };


    static defaultProps = {
        onPress: ()=>null
    };

    _offer() {

    }

    /*
     <View
     style={{borderBottomWidth:1/PixelRatio.get(),borderBottomColor:"rgb(250,250,250)",flex:1,flexDirection:"row",paddingLeft:10	,paddingRight:10,paddingTop:10,paddingBottom:10}}>
     <View style={{flex:0.5,flexDirection:"row",alignItems:"center"}}>
     <Icon
     name='md-eye'
     size={28}
     color='rgb(170,170,170)'
     />
     <Text style={{paddingLeft:7,color:"rgb(150,150,150)"}}>
     {topic.visit_count}
     </Text>
     </View>
     <View style={{flex:0.5,flexDirection:"row",justifyContent:"flex-end"}}>
     <View style={{flexDirection:"row",alignItems:"center"}}>
     <Icon
     name='ios-chatbubbles'
     size={28}
     color='rgba(0,0,0,0.9)'
     style={styles.icon}
     onPress={()=>{
     this.props.toComment(topic)
     }}
     />
     <Text style={{paddingLeft:10,paddingRight:15}}>
     {topic.reply_count}
     </Text>
     </View>
     <View style={{flexDirection:"row",alignItems:"center"}}>
     <Icon
     name='ios-heart-outline'
     size={28}
     color='rgba(0,0,0,0.9)'
     style={styles.icon}
     onPress={this.props.more}
     />
     <Text style={{paddingLeft:10}}>
     {topic.love_count || 0}
     </Text>
     </View>
     </View>
     </View>*/
    _getFooter(_topic) {
        let topic = _topic;

        return (

            <View
                style={{borderTopWidth:1/PixelRatio.get(),borderTopColor:"rgb(250,250,250)",alignItems:"center",flex:1,flexDirection:"row",paddingLeft:10	,paddingRight:10}}>
                <View style={{flex:0.5,flexDirection:"row",alignItems:"center"}}>
                    <Icon
                        name='md-eye'
                        size={28}
                        color='rgb(170,170,170)'
                    />
                    <Text style={{paddingLeft:7,color:"rgb(150,150,150)"}}>
                        {topic.visit_count}
                    </Text>
                </View>
                <View
                    style={{paddingTop:10,flex:0.5,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                    <Button
                        color="#fff"
                        backgroundColor='rgb(205,88,80)'
                        onPress={()=>{
                            this.props.add(topic.id)
                        }}
                        radius={10}>我要出价
                    </Button>
                </View>
            </View>
        )
    }

    _getHeader(topic) {

        return (

                <View>
                    <View style={ styles.row }>
                        <View style={styles.imgWrapper}>
                            <ResponsiveImage
                                ref={view => this.imgView=view}
                                style={styles.img}
                                source={{uri: parseImgUrl(topic.author.avatar_url) }}/>
                        </View>

                        <View style={[styles.topic]}>
                            <View style={{flex:0.8,flexDirection:"row",alignItems:"center"}}>
                                <Text
                                    ref={view => this.titleText=view}
                                    numberOfLines={1}
                                    style={[styles.title,{flex:0.8}]}>

                                    { topic.author.loginname}

                                </Text>
                                <View

                                    style={{flexDirection:"row",justifyContent: "flex-end",flex:0.2}}>
                                    <Icon
                                        name='md-more'
                                        size={28}
                                        color='rgb(170,170,170)'
                                        onPress={
									()=>{this.props.more(topic)}
								}
                                    />
                                </View>
                            </View>

                            <View style={[styles.topicFooter]}>
                                { this.props.footer }
                            </View>
                        </View>

                    </View>

                    <View style={{flex:1,paddingTop:10,paddingLeft:15,paddingRight:15,paddingBottom:10}}
                    >

                        <Text style={{fontSize:16}}>
                            {topic.title}
                        </Text>
                    </View>
                </View>)
    }

    paddingFix(i, row) {
        if (i === 0) {
            return {
                marginRight: spacing,
            }
        } else if (i === row) {
            return {
                marginLeft: spacing
            }
        }
        else {
            return {
                marginHorizontal: spacing,
            }
        }
    }

    _onMomentumScrollEnd(e, state, context) {
        // you can get `state` and `this`(ref to swiper's context) from params
        console.log(state, context.state)
    }

    renderCarousel(images) {
        return (
            <Swiper style={styles.wrapper}
                    onMomentumScrollEnd={this._onMomentumScrollEnd}
                    showsButtons={true}>
                {images.map((item, ii) => (
                    <View style={styles.slide}>
                        <ImageZoom
                            scale={2}
                            scaleType="center"
                            style={{flex: 1,height:width}}
                            source={{ uri:item,width:width}}
                        />
                    </View>
                ))}
            </Swiper>

        )

    }

    _getBody(images) {
        //let _me = this;
        //let _body = [];
        //let itemsPerRow = 3;
        //let data = _.chunk(images, itemsPerRow); // [[],[],[]]
        //data.forEach(function (rowData, i) {
        //    _body.push(
        //        <View key={i} style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
        //            {rowData.map((item, ii) => (
        //                <TouchableOpacity key={ii} style={{flex:1, }}>
        //                    <Lightbox swipeToDismiss={false} renderContent={()=>_me.renderCarousel(images)}>
        //                        <Image
        //                            host={_me.props.host}
        //                            style={[{flex:1, height: width/(itemsPerRow), marginVertical:2 },_me.paddingFix(ii,itemsPerRow-1)]}
        //                            source={{uri: getImgSize(item,width)}}
        //                        />
        //                    </Lightbox>
        //                </TouchableOpacity>
        //            ))}
        //        </View>
        //    )
        //});
        return (
            (images || []).length > 0 ?
                <View style={{position:"relative",paddingLeft:10,paddingRight:10}}>
                    <Lightbox swipeToDismiss={false} renderContent={()=>this.renderCarousel(images)}>
                        <LazyloadImage
                            host={this.props.host}
                            resizeMode="cover"
                            style={[{flex:1, width:width-20,height:height*0.3}]}
                            source={{uri: getImgSize(images[0],width-20)}}
                            defaultSource={require('../images/loading.gif')}
                        />
                    </Lightbox>
                    <View
                        style={{backgroundColor:"rgba(0,0,0,0.6)",position:"absolute",right:10,bottom:5,width:50,height:30,alignItems:"center",justifyContent: "center"}}>
                        <Text style={{color:"#fff",fontSize:14}}>{images.length}</Text>
                    </View>
                </View>
                : null
        )
    }

    render() {
        const {topic} = this.props;
        return (
            <TouchableOpacity
                onPress={()=>{this.props.onPress(topic)}}
                underlayColor='#3498DB'
                key={topic.id}>
            <View host={this.props.host} style={{backgroundColor:"#fff",marginTop:3}}>
                {this._getHeader(topic)}
                {this._getBody(topic.images)}
                {this._getFooter(topic)}
            </View>
            </TouchableOpacity>

        )
    }
}


const styles = StyleSheet.create({
    "row": {
        "flexDirection": "row",
        "borderBottomColor": "rgba(0, 0, 0, 0.02)",
        "borderBottomWidth": 1,
        "paddingTop": 10,
        "paddingRight": 0,
        "paddingBottom": 10,
        "paddingLeft": 10,
        height:60
    },
    "imgWrapper": {
        "width": 60,
        "position": "absolute",
        "left": 10,
        "top": 10,
        "height": 60
    },
    "img": {
        "height": 40,
        "width": 40,
        "borderRadius": 20
    },
    "topic": {
        "marginLeft": 60,
        width: width - 100
    },
    "title": {
        "fontSize": 15
    },
    "topicFooter": {
        "marginTop": 12,
        "flexDirection": "row"
    },
    boxImage1: {
        flex: 1
    },
    boxImage2: {
        flex: 0.5
    },
    boxImage3: {
        flex: 0.33
    },
    slide:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});


export default TopicRow;
