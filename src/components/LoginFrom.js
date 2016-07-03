/**
 * Created by zack on 16/6/5.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    View
} from 'react-native';
const defaultColor = '#222';
// export const primary = '#08e';
const primary = '#0094EA';

const secondary = '#1c7'

const error = '#fa0008'

const success = '#5cb85c';
const info = '#007BF8';

const textBody = '#222'
const grey = '#979797';
const lightGrey = '#eee';
const darkGrey = '#838582'
// spacing
const gutter = 10;

const btnText = '#fff';


// alert message
const alertMessage = {
    color: '#fff',
    backgroundColor: success
}

import variables from 'react-native-uikit'

import { Button,InputField, LoginFb, FieldError } from 'react-native-uikit'

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            password: ''
        }
        this._onPhoneChange = this._onPhoneChange.bind(this)
        this._onPasswordChange = this._onPasswordChange.bind(this)
        this._onSubmit = this._onSubmit.bind(this)
    }

    _onPhoneChange(text) {
        this.setState({
            phoneNumber: text
        })
    }

    _onPasswordChange(text) {
        this.setState({
            password: text
        })
    }

    _onSubmit() {
        this.props.onSubmit(this.state.phoneNumber.trim(), this.state.password)
    }

    render() {
        const {backgroundColor, inputRadius, color, error, onSubmit, loginFb, errorMsg, btnBackgroundColor, btnColor, btnRadius} = this.props;
        return (
            <View style={styles.form}>
                <InputField
                    placeHolder={'手机号码'}
                    radius={inputRadius}
                    onChange={this._onPhoneChange}
                />
                <InputField
                    placeHolder={'密码'}
                    radius={inputRadius}
                    onChange={this._onPasswordChange}
                    secureTextEntry={true}
                />
                <FieldError
                    errorMsg={errorMsg}
                    error={error}
                />
                <Button
                    color={btnColor}
                    backgroundColor={btnBackgroundColor}
                    onPress={this._onSubmit}
                    radius={btnRadius}>登录
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    form: {
        //flex:1,
        //paddingHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 50,
    },
});
LoginForm.defaultProps = {
    error: false,
    errorMsg: 'something went wrong'
}
LoginForm.propTypes = {
    backgroundColor: React.PropTypes.string,
    radius: React.PropTypes.number,
    color: React.PropTypes.string,
    errorMsg: React.PropTypes.string,
}
export default LoginForm;
