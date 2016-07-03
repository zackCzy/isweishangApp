/**
 * Created by zack on 16/6/13.
 */
'use strict';

import React, {
    Component,
} from 'react';
import {
    Linking,
    Platform,
    ActionSheetIOS,
    Dimensions,
    View,
    Text,
    Navigator,
    DeviceEventEmitter
} from 'react-native';
import Nav from '../components/Nav';
import Icon from 'react-native-vector-icons/Ionicons';

import  GiftedMessenger from 'react-native-gifted-messenger';
import  Communications  from 'react-native-communications';
var STATUS_BAR_HEIGHT = 24;

if (Platform.OS === 'android') {
    var ExtraDimensions = require('react-native-extra-dimensions-android');
    var STATUS_BAR_HEIGHT = 24;// ExtraDimensions.get('STATUS_BAR_HEIGHT');
}

const myUserId="13928865964";

class GiftedMessengerContainer extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.index=this.props.index;
        this.count=this.props.count;
        this.state = {
            messages:this.props.messages,
            isLoadingEarlierMessages: false,
            typingMessage: '',
            allLoaded: false,
            type:5,
            targetId:this.props.userId,
            oldestMessageId:-1,
            count:20
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.messages&&nextProps.messages !== this.state.messages) {
            this._messages=this._messages.concat(nextProps.messages);
            this.setMessages(this._messages);
        }
    }


    componentDidMount() {
        this._isMounted = true;
        const {actions,messages} =this.props;
        this._messages =messages||[];
        actions.clearMessagesUnreadStatus(this.state.type,this.state.targetId,this.index);
        actions.getHistoryMessagesType(this.state.type,this.state.targetId,this.state.oldestMessageId,this.state.count);

        DeviceEventEmitter.addListener('updateMessage', this.handleReceive.bind(this));
        //this.setMessages(this._messages);
        //this.setState({
        //    typingMessage: '正在加载',
        //});
        //this.setState({
        //    typingMessage: '',
        //});
      /*
        setTimeout(() => {
            this.handleReceive({
                text: 'Hello Awesome Developer',
                name: 'React-Bot',
                image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
                position: 'left',
                date: new Date(),
                uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
            });
        }, 3300); // simulating network*!/*/
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

   /* getInitialMessages() {
        return [
            {
                text: 'Are you building a chat app?',
                name: 'React-Bot',
                image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
                position: 'left',
                date: new Date(2016, 3, 14, 13, 0),
                uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
            },
            {
                text: "Yes, and I use Gifted Messenger!",
                name: 'Awesome Developer',
                image: null,
                position: 'right',
                date: new Date(2016, 3, 14, 13, 1),
                uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
            },
        ];
    }*/

    setMessageStatus(uniqueId, status) {
        let messages = [];
        let found = false;
        for (let i = 0; i < this._messages.length; i++) {
            if (this._messages[i].uniqueId === uniqueId) {
                let clone = Object.assign({}, this._messages[i]);
                clone.status = status;
                messages.push(clone);
                found = true;
            } else {
                messages.push(this._messages[i]);
            }
        }
        if (found === true) {
            this.setMessages(messages);
        }
    }

    setMessages(messages) {
        // append the message\
        for(var  i=0;i<messages.length;i++){
            messages[i]['date']=new Date(messages[i]['date']+1464590458438);
        }
        let oldestMessageId=this.state.oldestMessageId;
        if(messages[0]&&messages[0]['messageId']){
            oldestMessageId=messages[0]['messageId'];
        }
        this.setState({
            messages: messages,
            oldestMessageId:oldestMessageId
        });
    }

    handleSend(message = {}) {

        // Your logic here
        // Send message.text to your server
        let {actions}=this.props;
        actions.sendMessage(this.state.type,message.text,this.state.targetId,"","");
        message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
        message.date=message.date.getTime()-1464590458438;
        this._messages=this._messages.concat(message);
        this.setMessages(this._messages);
    ;

        // mark the sent message as Seen
        setTimeout(() => {
            this.setMessageStatus(message.uniqueId, 'Seen'); // here you can replace 'Seen' by any string you want
        }, 1000);

        // if you couldn't send the message to your server :
        // this.setMessageStatus(message.uniqueId, 'ErrorButton');
    }

    onLoadEarlierMessages() {

        // display a loader until you retrieve the messages from your server
        this.setState({
            isLoadingEarlierMessages: true,
        });
        const {actions} =this.props;
        actions.getHistoryMessagesType(this.state.type,this.state.targetId,this.state.oldestMessageId,this.count)
        // Your logic here
        // Eg: Retrieve old messages from your server

        // IMPORTANT
        // Oldest messages have to be at the begining of the array
        var earlierMessages = [
            {
                text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
                name: 'React-Bot',
                image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
                position: 'left',
                date: new Date(2016, 0, 1, 20, 0),
                uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
            }, {
                text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
                name: 'Awesome Developer',
                image: null,
                position: 'right',
                date: new Date(2016, 0, 2, 12, 0),
                uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
            },
        ];

        setTimeout(() => {
            this.setMessages(earlierMessages.concat(this._messages)); // prepend the earlier messages to your list
            this.setState({
                isLoadingEarlierMessages: false, // hide the loader
                allLoaded: true, // hide the `Load earlier messages` button
            });
        }, 1000); // simulating network

    }

    handleReceive(message = {}){
        if(message.sendUserId==this.state.targetId){
            this._messages=this._messages.concat(message);
            this.setMessages(this._messages);
        }
    }


    onErrorButtonPress(message = {}) {
        // Your logic here
        // re-send the failed message
        // remove the status
        this.setMessageStatus(message.uniqueId, '');
    }

    // will be triggered when the Image of a row is touched
    onImagePress(message = {}) {
        // Your logic here
        // Eg: Navigate to the user profile
    }

    render() {
        const {actions,router} =this.props;
        const navs = {
            Left: {
                text: <Icon
                    name='md-arrow-back'
                    size={34}
                    color='rgba(255,255,255,0.9)'
                    style={[{fontSize:22,borderRadius:50,borderWidth:2,borderColor:"#fff"}]}
                />,
                onPress: ()=> {
                    actions.getRongiMList();
                    router.pop();
                }
            },
            Center: {
                text: '与'+this.state.targetId+"的聊天"
            }
        };
        return (
            <View>
                <Nav navs={navs}/>
                <GiftedMessenger
                    ref={(c) => this._GiftedMessenger = c}
                    styles={{
                  bubbleRight: {
                    marginLeft: 70,
                    backgroundColor: '#007aff',
                  },
                }}
                    autoFocus={false}
                    messages={this.state.messages}
                    handleSend={this.handleSend.bind(this)}
                    onErrorButtonPress={this.onErrorButtonPress.bind(this)}
                    maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}
                    loadEarlierMessagesButton={!this.state.allLoaded}
                    onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

                    senderName='Awesome Developer'
                    senderImage={null}
                    onImagePress={this.onImagePress}
                    displayNames={true}

                    parseText={true} // enable handlePhonePress, handleUrlPress and handleEmailPress
                    handlePhonePress={this.handlePhonePress}
                    handleUrlPress={this.handleUrlPress}
                    handleEmailPress={this.handleEmailPress}

                    isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}

                    typingMessage={this.state.typingMessage}
                />
            </View>
        );
    }

    handleUrlPress(url) {
        Linking.openURL(url);
    }

    // TODO
    // make this compatible with Android
    handlePhonePress(phone) {
        if (Platform.OS !== 'android') {
            var BUTTONS = [
                'Text message',
                'Call',
                'Cancel',
            ];
            var CANCEL_INDEX = 2;

            ActionSheetIOS.showActionSheetWithOptions({
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            Communications.phonecall(phone, true);
                            break;
                        case 1:
                            Communications.text(phone);
                            break;
                    }
                });
        }
    }

    handleEmailPress(email) {
        Communications.email(email, null, null, null, null);
    }

}
export const LayoutComponent = GiftedMessengerContainer;

export function mapStateToProps(state, props) {
    const {userId = '0'} = props;
    const messages = state.chat.chat[userId];
    console.log(messages,props.messages)
    return {
        messages:messages||props.messages
    }
}
