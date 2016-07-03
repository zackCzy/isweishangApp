import React,{Component,PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    StatusBar,
    PixelRatio,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import ScrollableTabs from '../components/ScrollableTabs';
import AddTopic from '../components/AddTopic';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from '../components/base/Modal';
import ShareView from '../components/Share'
import * as TopicListComponent from './TopicList';
import * as Tabs from '../constants/Tabs';
import connectComponent from '../utils/connectComponent';
const TopicList = connectComponent(TopicListComponent);
const {height, width} = Dimensions.get('window');
const textColor = 'rgba(0,0,0,0.7)';
const contentHeight = height - 51 * 2 - 55;
const topHeight = Platform.OS === 'ios' ? 75 : 55;
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view';
import { Button} from 'react-native-uikit';

export default class Home extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.isClientUser = props.isClientUser;
        this.state = {
            selectTab: '',
            isPickerShow: false,
            dirty: false,
            add: false,
        };
    }

    componentDidMount() {
        const {actions} = this.props;
        actions.updateTopicsByTab('buy');
    }

    componentDidUpdate() {
        this.isClientUser = this.props.user.secret !== null;
    }


    _onPageChanged(page) {
        const {actions, topic, ui} = this.props;
        const tab = Tabs.tabs[page.i];
        if (topic[tab] && ui[tab] && !ui[tab].flag) {
            actions.updateTopicsByTab(tab);
        }
    }

    _addTopic() {
        if (!this.state.add) {
            this._addTopicView.show();
        } else {
            this._addTopicView.hide();
        }
        this.setState({
            add: !this.state.add,
            height: this.state.add ? 0 : height
        });
    }

    _offer(id){
        this.setState({
            isPickerShow:true,
            PriceId:id
        });
    }
    _renderTopicList() {
        let tabs=['推荐', '正在直播', '我想买', '我想卖'];
        return ['good', 'live', 'buy', 'sell'].map((item,i)=> {
            return (
                <TopicList router={this.props.router}
                           key={item}
                           tab={item}
                           tabLabel={tabs[i]}
                           add={this._offer.bind(this)}
                />
            );
        });
    }
    _onPrice(text){
        if(isNaN(text)){
            return false;
        }
        this.setState({
            Price:text
        })
    }
    //确认出价
    isPrice(){

        const {actions,user}=this.props;
        if(this.state.Price.length<=0){
            return actions.toast("你还没有输入价格");
        }
        if(!this.state.PriceId){
            return actions.toast("你还有选择主题");
        }
        this.props.actions.replyTopicById({
            topicId: this.state.PriceId,
            content: this.state.Price,
            user: {
                loginname: user.loginname,
                avatar_url: user.profile_image_url
            }
        }, ()=> {
            // resolved
            actions.toast("报价成功");
            this._closePrice();
        }, ()=> {
            // rejected
            actions.toast("报价失败");
            this._closePrice();
        });
    }
    _closePrice(){
        this.setState({
            isPickerShow: false,
            Price:0,
            PriceId:null
        });
    }
    scrollToTop() {
        //this._listView.scrollTo({
        //    x: 0,
        //    y: 0
        //});
    }
    //分享


    render() {
        const {router, user, message} = this.props;

        const Right = <Icon
            name='ios-add'
            size={34}
            color='rgba(255,255,255,0.9)'
            style={styles.icon}
        />
        const modal = (
            <Modal
                onPressBackdrop={this._closePrice.bind(this)}
                style={styles.modal}
            >
                <View style={[styles.pickerIOS,{backgroundColor:"rgb(230,230,230)"}]}>
                    <View style={{flexDirection: "row", backgroundColor:"rgb(43,134,214	)",paddingLeft:6,justifyContent:"center",marginBottom:5,height:50,borderBottomColor:"#ccc",borderBottomWidth:1/PixelRatio.get()}}>
                        <Text style={{lineHeight:32, fontSize:17,color:"#ccc",width:width-55}}>
                            确认你的出价
                        </Text>
                        <Icon
                            name='ios-close'
                            size={35}
                            color='#fff'
                            style={[styles.icon,{marginTop:5,width:45}]}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        autoFocus={true}
                        keyboardType="numeric"
                        placeholder='请输入你的价格'
                        placeholderTextColor="rgb(200,200,200)"
                        onChangeText={(text)=>{this._onPrice(text)}}
                        underlineColorAndroid={'#00000000'}
                        value={this.state.Price}
                    />
                    <View style={{paddingLeft:10,paddingRight:10,marginTop:15}}>
                        <Button
                            color="#fff"
                            backgroundColor='rgb(205,88,80)'
                            onPress={this.isPrice.bind(this)}
                            radius={10}>确认出价
                        </Button>
                    </View>

                </View>
            </Modal>
        );
        return (

            <View style={styles.container}>
                <ScrollableTabView
                    style={{marginTop:topHeight,paddingTop:25}}
                    renderTabBar={()=><DefaultTabBar style={{height:30}} inactiveTextColor="rgb(177,178,177)" underlineColor="rgb(231,74,37)" activeTextColor="rgba(231,74,37,1)"  activeTab="我想买"  backgroundColor='#fff' />}
                    tabBarPosition='overlayTop'
                    onChangeTab={this._onPageChanged.bind(this)}
                    initialPage={2}
                >
                    { this._renderTopicList() }
                </ScrollableTabView>

                <TouchableWithoutFeedback onPress={this._addTopic.bind(this)}>
                    <View
                        style={{position:"absolute",left:0,top:topHeight,flex:1,backgroundColor:"rgba(0,0,0,0.3)",width:width,height:this.state.height}}>
                    </View>
                </TouchableWithoutFeedback>
                <ShareView ref={view=>this._shareView=view} />

                <AddTopic ref={view=>this._addTopicView=view}>

                    <View style={styles.topSelectWrap}>
                        <TouchableOpacity
                            onPress={()=>{
                            if(!this.isClientUser){
                                router.toLogin();
                                return false;
                            }
                            this._addTopic();
                            router.toPublish({
                                type:"buy"
                            })}
                            }
                            underlayColor='#3498DB'
                            style={[styles.topBorder,styles.topOption]}
                        >
                            <View>
                                <Icon
                                    name='ios-cart'
                                    size={45}
                                    color='rgba(226,54,50,0.9)'
                                    style={styles.icon}
                                />
                                <Text>我想买</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                            if(!this.isClientUser){
                                router.toLogin();
                                return false;
                            }
                            this._addTopic();
                            router.toPublish({
                                type:"sell"
                            })}}
                            underlayColor='#3498DB'
                            style={[styles.topBorder,styles.topOption]}
                        >
                            <View>
                                <Icon
                                    name='ios-cart-outline'
                                    size={45}
                                    color='rgba(226,54,50,0.9)'
                                    style={styles.icon}
                                />
                                <Text>我想卖</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                            if(!this.isClientUser){
                                router.toLogin();
                                return false;
                            }
                            this._addTopic();
                            router.toPublish({
                                type:"live"
                            })}}
                            underlayColor='#3498DB'
                            style={[styles.topBorder,styles.topOption]}
                        >
                            <View>
                                <Icon
                                    name='md-easel'
                                    size={45}
                                    color='rgba(226,54,50,0.9)'
                                    style={styles.icon}
                                />
                                <Text>发直播</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </AddTopic>
                <View style={{position:"absolute",left:0,top:0}}>
                    <Header
                        user={user}
                        router={router}
                        message={message}
                        text={"发现"}
                        Right={{
                        text:Right,
                        onPress:this._addTopic.bind(this)
                        }}
                    />
                </View>
                {this.state.isPickerShow && modal}
            </View>
        );
    }
}


const styles = StyleSheet.create({

    container: {
        backgroundColor: 'rgb(241,239,250)',
        flex: 1
    },
    bg: {
        width,
        height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectorIcon: {
        height: 20,
        width: 20
    },
    labelIcon: {
        marginRight: 15
    },
    tabSelectorText: {
        flex: 1,
        color: textColor
    },
    titleInput: {
        height: 50,
        flex: 1,
        color: textColor,
        fontSize: 14
    },
    content: {
        paddingRight: 15,
        paddingLeft: 15
    },
    topicContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingTop: 20,
        height: contentHeight
    },
    modal: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 55,
        bottom: 55,
        paddingBottom: 55,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    pickerIOS: {
        flex: 1,
        height: 200,
        backgroundColor: 'white'
    },
    pickerAndroid: {
        flex: 1
    },
    topSelectWrap: {
        width: width,
        flex: 1,
        flexDirection: 'row',
        height: 90,
        backgroundColor: "#fff",
        paddingTop: 12,
        paddingBottom: 12,
    },
    topBorder: {
        borderRightColor: "#cbcbcb",
        borderRightWidth: 1 / PixelRatio.get()
    },
    topOption: {
        flexDirection: 'column',
        flex: 0.33,
        alignItems: "center",
        justifyContent: 'center'
    },
    input:{
        width:width-30,
        height:50,
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        paddingLeft:10,
        paddingRight:10,
        borderBottomColor:"#ccc",
        borderBottomWidth:1/PixelRatio.get(),
        backgroundColor:"#fff"
    }

});


export const LayoutComponent = Home;
export function mapStateToProps(state, props) {
    const isClientUser = state.user.secret !== null;
    return {
        user: state.user,
        message: state.message,
        topic: state.topic,
        isClientUser: isClientUser,
        ui: state.home
    }
}
