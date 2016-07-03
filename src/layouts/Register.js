/**
 * Created by zack on 16/6/9.
 */
import React,{Component} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    PixelRatio,
    ScrollView
} from 'react-native';
import Nav from '../components/Nav';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button} from 'react-native-uikit'
import * as userService from '../services/userService';

export default class Register extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            sendCode: false,
            sendCodeStr: "发送验证码",
            phoneNumber: "",
            code: "",
            passwrod: ""
        };
    }

    _onPhoneChange(text) {
        this.setState({
            phoneNumber: text
        });
    }

    _onCodeNum(text) {
        this.setState({
            code: text
        });
    }

    _onPressword(text) {
        this.setState({
            passwrod: text
        });
    }

    _sendCode() {
        if (this.state.sendCode) {
            return false;
        }
        const {actions} = this.props;

        let phoneNum = this.state.phoneNumber;
        if (phoneNum.length <= 0) {
            return actions.toast("手机号码不能为空");
        } else if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(phoneNum)) {
            return actions.toast("手机号码不正确");
        }
        this.setState({
            sendCode: true
        });
        let _me = this;
        userService.sendCode(phoneNum).then(data=> {
            if (data.result == 1) {
                _me._timer();
            } else {
                _me.setState({
                    sendCode: false
                });
            }
            actions.toast(data.msg);
        });

    }

    _timer() {
        let time = 60;
        let _me = this;

        let timer = setInterval(function () {

            if (time <= 0) {
                _me.setState({
                    sendCode: false,
                    sendCodeStr: "发送验证码"
                });
                return clearInterval(timer);
            }
            _me.setState({
                sendCodeStr: --time
            });
        }, 1000);
    }
    _check(account,code,passwrod,callback){
        if (!account || account.length <= 0) {
            return callback('手机号不能为空');
        }
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(account)) {
            return callback('手机号码不正确');
        }
        if (code.length < 6) {
            return callback('验证码错误');
        }
        if (password.length < 6) {
            return callback('密码最短为 6 个字符');
        }

        callback(null);
    }
    _onSubmit() {
        const {actions,router} =this.props;
        let account = this.state.phoneNumber;
        let code = this.state.code;
        let passwrod = this.state.passwrod;
        let _me=this;
        this._check(account,code,passwrod,(err)=>{
            if(err){
                return actions.toast(err);
            }
            userService.register(account, code, passwrod).then(data=> {
                if (data.result == 1) {
                    return actions.toast("注册成功");
                    router.toHome();
                }
                actions.toast("注册失败")
            })
        })

    }

    render() {
        const {router} =this.props;
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
                text: '注册'
            }
        };
        return (
            <View style={styles.container}>
                <Nav navs={navs}/>
                <ScrollView style={{flex:1,paddingLeft:16,paddingRight:16,paddingTop:30}}>
                    <View style={styles.from}>
                        <View style={styles.iconWraper}>
                            <Icon
                                name='ios-phone-portrait'
                                size={34}
                                color='rgb(146,146,146)'
                                style={[{fontSize:22,borderRadius:50,borderWidth:2,borderColor:"#fff"}]}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='输入手机号'
                            placeholderTextColor="rgb(246,246,246)"
                            onChangeText={(text)=>{this._onPhoneChange(text)}}
                            underlineColorAndroid={'#00000000'}
                        />
                    </View>
                    <View style={styles.from}>
                        <View style={styles.iconWraper}>

                            <Icon
                                name='md-lock'
                                size={34}
                                color='rgb(146,146,146)'
                                style={[{fontSize:22,borderRadius:50,borderWidth:2,borderColor:"#fff"}]}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='输入验证码'
                            placeholderTextColor="rgb(246,246,246)"

                            onChangeText={(text)=>{this._onCodeNum(text)}}
                            underlineColorAndroid={'#00000000'}
                        />
                        <View style={{width:100,height:50}}>
                            <Button
                                color="#fff"
                                onPress={this._sendCode.bind(this)}
                            >{this.state.sendCodeStr}
                            </Button>
                        </View>
                    </View>
                    <View style={styles.from}>
                        <View style={styles.iconWraper}>

                            <Icon
                                name='md-lock'
                                size={34}
                                color='rgb(146,146,146)'
                                style={[{fontSize:22,borderRadius:50,borderWidth:2,borderColor:"#fff"}]}
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder='设置密码,6-18位'
                            secureTextEntry={true}
                            placeholderTextColor="rgb(246,246,246)"
                            onChangeText={(text)=>{this._onCodeNum(text)}}
                            underlineColorAndroid={'#00000000'}
                        />
                    </View>
                    <View style={{flex:1,paddingTop:25,paddingLeft:10,paddingRight:10}}>
                        <Button
                            color="#fff"
                            style={{flex:1,height:60}}
                            backgroundColor='rgb(205,88,80)'
                            onPress={this._onSubmit.bind(this)}
                            radius={10}>登录
                        </Button>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    from: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 3,
        paddingRight: 3,
        alignItems: "center",
        borderBottomColor: 'rgba(225,225,225,0.5)',
        borderBottomWidth: 1 / PixelRatio.get(0),
        marginBottom: 8,
    },
    input: {
        flex: 1,
        height: 53,
        fontSize: 17,
        paddingHorizontal: 10,
    },
    iconWraper: {
        width: 40, height: 40, alignItems: "center",
        justifyContent: "center"
    }
});
export const LayoutComponent = Register;
