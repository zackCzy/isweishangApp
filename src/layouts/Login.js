import React,{Component} from 'react';

import  {
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet,
    Dimensions,
    Image,
    TextInput,
    PixelRatio,
    ScrollView,
    NativeModules
} from 'react-native';
import * as MobService from '../services/MobService';
import Loading from 'react-native-loading-w';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconn from '../configs/iconfont';
import Nav from '../components/Nav';
//import Camera from 'react-native-camera';
import NavigationBar from 'react-native-navbar';
import LoginForm from '../components/LoginFrom';
const {height, width} = Dimensions.get('window');

class Login extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            account: "",
            password: ""
        }
    }

    _checkData(account, password, callback) {
        if (!account || account.length <= 0) {
            return callback('手机号不能为空');
        }
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(account)) {
            return callback('手机号码不正确');
        }
        if (password.length < 6) {
            return callback('密码最短为 6 个字符');
        }
        callback(null);
    }

    _onLoginPress2(account, password) {
        const {router,actions} = this.props;
        this._checkData(account, password, (error)=> {
            if (error)
                return actions.toast(error);
            actions.login(account, password, ()=> {
                actions.toast('帐号密码错误');

            }, (data)=> {
                console.log(data)
                if (data && data.secret) {
                    router.pop();
                    actions.toast('登陆成功');
                }
            });
        });
    }


    _onPhoneChange(text) {
        this.setState({
            email: text
        })
    }

    _onPasswordChange(text) {
        this.setState({
            password: text
        })
    }

    _onSubmit() {
        this.props.onSubmit(this.state.email, this.state.password)
    }

    getLoading() {
        return this.refs['loading'];
    }

    _onPressButton(name) {
        const {router,actions} = this.props;
        let self = this;
        this.getLoading().show(true);
        //MobService.shareQQ("1233","http://ww.baidu.com",null,null).then(data=>{
        //    console.log(data)
        //}).catch(err=>{
        //    console.log(err);
        //})
        MobService.login(name).then(function (userLoginInfo) {
            let {userid,gender, figureurl_qq_2, nickname}=userLoginInfo;
            let openid = userid;
            let sex = gender;
            let headimgurl = figureurl_qq_2;
            let id = name.toLocaleString();
            actions.mobLogin({
                id: id,
                openid: openid,
                nickname: nickname,
                sex: sex,
                headimgurl: headimgurl,
                resolved: ()=> {
                    self.getLoading().dismiss();
                    actions.toast('登录成功');
                    router.pop();
                },
                rejected: ()=> {
                    self.getLoading().dismiss();
                    actions.toast('帐号密码错误');
                }
            });
        }).catch((err)=> {
            self.getLoading().dismiss();
        });
    }

    render() {
        const {router} = this.props;
        //this.getLoading().show(true);
        const navs = {
            Left: {
                text: <Icon
                    name='md-arrow-back'
                    size={34}
                    color='rgba(255,255,255,0.9)'
                    style={[{fontSize:22,borderRadius:50,borderWidth:2,borderColor:"#fff"}]}
                />,
                onPress: ()=> {
                    router.pop();
                }
            },
            Center: {
                text: '登录'
            },
            Right: {
                text: "注册",
                onPress: ()=> {
                    router.toRegister();
                }
            }
        };
        return (
            <View style={styles.wrapper}>
                <Nav navs={navs}/>

                <View style={styles.inputWrapper}>
                    <LoginForm
                        onSubmit={(account, password) =>this._onLoginPress2(account,password)}
                        error={false}
                        errorMsg={'用户名密码错误'}
                        btnBackgroundColor={"rgba(205,54,52,0.8)"}
                    />

                    <View style={styles.authLogin}>
                        <View style={styles.authItem}>
                            <TouchableOpacity onPress={
                                this._onPressButton.bind(this,"Wechat")
                            }>

                                <Iconn
                                    name='dengluweixin'
                                    size={74}
                                    color='rgb(109,207,46)'
                                />

                            </TouchableOpacity>
                        </View>
                        <View style={styles.authItem}>
                            <TouchableOpacity onPress={this._onPressButton.bind(this,"QQ")}>

                                <Iconn
                                    name='dengluqq'
                                    size={74}
                                    color='rgb(64,170,235)'
                                />

                            </TouchableOpacity>
                        </View>
                        <View style={styles.authItem}>
                            <TouchableOpacity onPress={
                                this._onPressButton.bind(this,"SinaWeibo")
                            }>

                                <Iconn
                                    name='tianxieziliaoweibo'
                                    size={74}
                                    color='rgb(230,46,37)'
                                />

                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                <Loading ref={'loading'} text={'正在登录...'}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'column',
        width,
        height,
        backgroundColor: '#fff',
        flex: 1
    },
    authLogin: {
        paddingTop: 8,
        paddingBottom: 10,
        flexDirection: "row",
        marginTop: 30,
        backgroundColor: "#fff"
    },
    authItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 45,
        borderBottomWidth: 0,
        padding: 10,
        marginBottom: 10,
        marginTop: 10
    },
    inputWrapper: {
        flexDirection: 'column',
        padding: 10,
        flex: 1,
        width,
        height
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 400
    },
    info: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    infoText: {
        color: 'rgba(255,255,255,0.5)'
    },
    iconButton: {
        paddingRight: 30,
        paddingLeft: 30
    },
    iconButtonText: {
        color: 'rgba(255,255,255,0.9)',
        justifyContent: "center"
    },
    closeIcon: {
        position: 'absolute',
        top: 40,
        right: 40
    },
    img: {
        width: 100,
        height: 100
    }
});


export const LayoutComponent = Login;
export function mapStateToProps(state) {
    return {
        ui: state.userUI
    };
}
