import React,{Component,PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from '../components/TabBar';
import Return from '../components/base/Return';
import MessageList from '../components/MessageList';
import Header from '../components/Header';
import ConversationList from '../components/ConversationList';

import {getToken} from './../services/token';

const {height, width} = Dimensions.get('window');
const STATUS_BAR_HEIGHT = 20;

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            didFocus: false
        };
    }


    componentDidMount() {
        this.props.actions.getRongiMList();
        this.props.actions.getMessageList();
    }


    componentWillUnmount() {
        this.props.actions.markAsRead();
    }


    componentDidFocus(haveFocused) {
        if (!haveFocused) {
            setTimeout(()=> {
                this.setState({
                    didFocus: true
                });
            });
        }
    }


    _renderTabBar() {
        const statusBarHeight = Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0;
        const props = {
            style: {
                backgroundColor: '#292829',
                height: 50 + 4 + statusBarHeight,
                paddingTop: statusBarHeight
            },
            activeTabTextColor: 'white',
            normalTabTextColor: 'rgba(255,255,255,0.7)',
            tabUnderlineStyle: {
                backgroundColor: 'rgba(241,196,15,1)'
            }
        };
        return (
            <TabBar {...props}/>
        )
    }

    _onPageChanged() {

    }

    render() {

        const {message,fetchMessagesPending, hasNotRead, hasRead, isMarkAsReadLoading, actions, router,user} = this.props;
        if (getToken() == undefined) {
            //router.toLogin();
        }
        return (

            <View style={styles.container}>
                <Header
                    user={user}
                    router={router}
                    message={message}
                    text={"消息"}
                    onPress={
							()=> {
								this.scrollToTop();
							}
					}
                />
                <ScrollableTabView
                    style={styles.scrollableTabView}
                    edgeHitWidth={(width/3)*2}
                    renderTabBar={this._renderTabBar.bind(this)}
                    onChangeTab={this._onPageChanged.bind(this)}
                >
                    <ConversationList
                        tab="聊天"
                        tabLabel="聊天"
                        userId={user.secret!==null? user.secret._id:0}
                        data={message.conversation}
                        onPress={(chat,index,userId)=>{
                            this.props.router.toChat({
                                userId: userId,
                                chat,
                                index:index
                            });
                        }}
                    />
                </ScrollableTabView>


            </View>
        )
    }
}

/*
 <MessageList
 router={router}
 didFocus={ this.state.didFocus }
 pending={ fetchMessagesPending }
 data={ this.state.didFocus ? hasNotRead : [] }
 style={styles.userTopicPage}
 tabLabel={ "未读消息 " + hasNotRead.length }
 getMessageList={actions.getMessageList}
 />
 <MessageList
 router={router}
 didFocus={ this.state.didFocus }
 pending={ fetchMessagesPending }
 data={ this.state.didFocus ? hasRead : [] }
 style={styles.userTopicPage}
 tabLabel={"已读消息 " + hasRead.length}
 getMessageList={actions.getMessageList}
 />
 */


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        height,
        width
    },
    scrollableTabView: {
        flex: 1
    }
});


export const LayoutComponent = Message;
export function mapStateToProps(state) {
    console.log(state);
    return {
        ...state.message,
        ...state.messageUI,
        message: state.message,
        user: state.user,

    }
}
