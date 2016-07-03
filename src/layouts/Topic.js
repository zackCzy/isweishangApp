import React,{Component,PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import CommentOverlay from '../components/CommentOverlay';
import Return from '../components/base/Return';
import Html from '../components/base/Html';
import Spinner from '../components/base/Spinner';
import {genColor, parseImgUrl,getImgSize} from '../utils';
import _ from 'lodash';
import Lightbox from 'react-native-lightbox';

const spacing = 2;
const {height, width} = Dimensions.get('window');
const topicAuthorWidth = 100;
const authorImgHeight = 40;
const contentPadding = 15;


class Topic extends Component {
    constructor(props) {
        super(props);
        this.headerColor = genColor();
        this.state = {
            didFocus: false
        }
        this.tab = {
            buy: "想买",
            sell: "想卖"
        }
    }


    componentDidMount() {
        const {from, actions, id, topic} = this.props;
        if (from !== 'comment' && topic) {
            actions.getTopicById(id);
        }
    }


    componentDidFocus(haveFocus) {
        if (!haveFocus) {
            setTimeout(()=> {
                this.setState({
                    didFocus: true
                });
            });
        }
    }


    componentWillUnmount() {
        this.props.actions.removeTopicCacheById(this.props.id);
    }


    _onAuthorImgPress(authorName) {
        this.props.router.toUser({
            userName: authorName
        });
    }

    _blur() {
        this.titleInput.blur();
        this.contentInput.blur()
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

    _getBody(images) {
        let _me = this;
        let _body = [];
        let itemsPerRow = 3;
        let data = _.chunk(images, itemsPerRow); // [[],[],[]]
        data.forEach(function (rowData, i) {
            _body.push(
                <View key={i} style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    {rowData.map((item, ii) => (
                        <TouchableOpacity key={ii} style={{flex:1, }}>
                            <Lightbox swipeToDismiss={false}>
                                <Image
                                    style={[{flex:1, height: width/(itemsPerRow), marginVertical:2 },_me.paddingFix(ii,itemsPerRow-1)]}
                                    source={{uri: getImgSize(item,width)}}
                                />
                            </Lightbox>
                        </TouchableOpacity>
                    ))}
                </View>
            )
        });
        return _body;
    }

    _renderTopicHtml(topic) {
        if (this.state.didFocus && topic && topic.content) {
            return (
                <View style={styles.content}>
                    <View style={{flexDirection:"row" }}>
                        <Text
                            style={{textAlign :"center",width:50,borderRadius:8, color:"#fff",backgroundColor:'rgb(212,60,55)',fontSize:15,paddingLeft:5,paddingRight:5,paddingTop:5,paddingBottom:5}}>
                            {this.tab[topic.tab]}
                        </Text>
                        <Text style={{fontSize:15,paddingLeft:5,paddingRight:5,paddingTop:5,paddingBottom:5}}>
                            {topic.title}
                        </Text>
                    </View>

                    <Html
                        router={this.props.router}
                        content={topic.content}/>
                </View>
            )
        }
        return (
            <Spinner
                size="large"
                animating={true}
                style={{marginTop:20}}/>
        )
    }


    _renderContent(topic) {
        if (topic) {
            const imgUri = parseImgUrl(topic.author.avatar_url);
            const authorName = topic.author.loginname;
            const date = moment(topic.create_at).startOf('minute').fromNow();


            return (
                <ScrollView>
                    <View style={[styles.header,{backgroundColor: this.headerColor}]}>
                        <View style={styles.authorTouchable}>
                            <View style={styles.authorWrapper}>
                                <TouchableOpacity
                                    onPress={this._onAuthorImgPress.bind(this, authorName)}>
                                    <Image
                                        source={{uri:imgUri}}
                                        style={styles.authorImg}>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>
                                {topic.author.loginname}
                            </Text>

                            <View style={styles.titleFooter}>
                                <View style={styles.date}>
                                    <Icon
                                        name='clock'
                                        size={12}
                                        color='rgba(255,255,255,0.5)'
                                        style={styles.dateIcon}
                                    />
                                    <Text style={styles.dateText}>
                                        {date}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    { this._renderTopicHtml(topic) }
                    <View style={{paddingLeft:10,paddingRight:10,paddingTop:15}}>
                        {this._getBody(topic.images)}
                    </View>
                </ScrollView>
            )
        }


        return (
            <Spinner
                size="large"
                animating={true}
                style={{marginTop:20}}/>
        )
    }


    _renderCommentOverlay(topic) {
        return (
            <CommentOverlay
                onPress={()=>{
					this.props.router.toComment({
						topic: topic,
						id:topic.id
					})
				}}
                replyCount={topic.reply_count}
            />
        )
    }


    render() {
        const {topic} = this.props;

        return (
            <View style={[styles.container]}>
                { this._renderContent(topic) }

                <Return position={{left:10,bottom:20}} router={this.props.router}/>
                { this.props.topic && this.state.didFocus && this.props.from !== 'comment' && this._renderCommentOverlay(topic) }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        backgroundColor: 'white',
        height: height
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 0
    },
    authorWrapper: {
        width: topicAuthorWidth - 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    authorImg: {
        width: authorImgHeight,
        height: authorImgHeight,
        borderRadius: authorImgHeight / 2
    },
    author: {
        paddingBottom: 12,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12
    },
    titleWrapper: {
        width: width - topicAuthorWidth - 20,
        flexDirection: 'column',
        paddingTop: 20,
        paddingBottom: 20
    },
    title: {
        color: 'rgba(255,255,255,0.9)',
        width: width - topicAuthorWidth - 20,
        justifyContent: 'flex-end',
        flex: 1,
        //lineHeight: 1.2 * 16
    },
    titleFooter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 20
    },
    date: {
        width: 100,
        flexDirection: 'row',
    },
    dateText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12
    },
    dateIcon: {
        width: 12,
        height: 16,
        marginRight: 8
    },
    like: {
        width: 20,
        flexDirection: 'row',
    },
    likeIcon: {
        width: 20,
        height: 16,
        marginRight: 8
    },
    content: {
        paddingRight: contentPadding,
        paddingLeft: contentPadding,
        paddingTop: contentPadding,
        paddingBottom: contentPadding,
        backgroundColor: 'white'
    }
});


export const LayoutComponent = Topic;
export function mapStateToProps(state, props) {
    const {id = '0'} = props;
    const topic = state.topic.topics[id];
    return {
        topic: topic || props.topic
    }
}
