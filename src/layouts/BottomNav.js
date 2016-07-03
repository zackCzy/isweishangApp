/**
 * Created by zack on 16/5/27.
 */
import React,{Component,PropTypes} from 'react';
import {
    View,
    StyleSheet
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';
import * as IndexComponent from './Index';
import * as MessageComponent from './Message';
import * as HomeComponent from './Home';
import connectComponent from '../utils/connectComponent';
const Index = connectComponent(IndexComponent);
const Message = connectComponent(MessageComponent);
const Home = connectComponent(HomeComponent);
import Start from '../layouts/Start';


class Footer extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab: "爱微商",
            tabBarShow: true
        };
    }

    _renderTabItem(img, selectedImg, tag, childView) {
        const {router}  =this.props;
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() =>img}
                title={tag}
                renderSelectedIcon={() => selectedImg}
                onPress={() => {
                    if(this.state.selectedTab === tag){
                        router.toBottomPublish();
                    }

					this.setState({ selectedTab: tag });
				}}>
                {childView}
            </TabNavigator.Item>
        );
    }

    _createChildView1(tag) {
        let renderView;
        switch (tag) {
            case '发现':
                renderView = <Home {...this.props}/>;
                break;
            case '爱微商':
                renderView = <Index {...this.props}/>;
                break;
            case '消息':
                renderView = <Message {...this.props} />;
                break;
            default:
                break;
        }
        return renderView
    }

    render() {
        const {router} =this.props;
        const _me = this;
        return (
            <TabNavigator style={{flex:1}} hidesTabTouch={true} tabBarStyle={styles.tab}>
                {this._renderTabItem.call(_me, <Icon
                    name='ios-home'
                    size={28}
                    color='rgba(231,65,69,0.2)'
                    style={styles.icon}/>, <Icon
                    name='ios-home'
                    size={28}
                    color='rgba(231,65,69,0.9)'
                    style={styles.icon}/>, '爱微商', this._createChildView1('爱微商'))}

                {this._renderTabItem.call(_me, <Icon
                    name='ios-pin'
                    size={28}
                    color='rgba(231,65,69,0.2)'
                    style={styles.icon}/>, <Icon
                    name='ios-pin'
                    size={28}
                    color='rgba(231,65,69,0.9)'
                    style={styles.icon}/>, '发现', this._createChildView1('发现'))}
                {this._renderTabItem.call(_me, <Icon
                    name='md-chatboxes'
                    size={28}
                    color='rgba(231,65,69,0.2)'
                    style={styles.icon}/>, <Icon
                    name='md-chatboxes'
                    size={28}
                    color='rgba(231,65,69,0.9)'
                    style={styles.icon}/>, '消息', this._createChildView1('消息'))}
            </TabNavigator>
        )
    }
}
class BottomNav extends Component {
    constructor(props) {
        super(props);
        //const {first}=;
        //
        this.state={
            first : this.props.first
        };
    }

    _close(){
        const {actions}=this.props;
        actions.firstOpenApp();
        this.setState({
            first:true
        });
    }
    render() {
        return (
            <View style={{flex:1}}>
                {!this.state.first&&<Footer {...this.props}></Footer>}
            </View>
        )
    }
}
//                {!this.state.first&&<Start onPress={this._close.bind(this)}></Start>}


const styles = StyleSheet.create({
    tab: {
        height: 48,
        backgroundColor: '#fff',
        alignItems: 'center'
    }
});


export const LayoutComponent = BottomNav;

export function mapStateToProps(state) {

    return {
        first:state.home.first||false
    };
}
