import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as userService from '../services/userService';
import * as tokenService from '../services/token';
import * as storageService from '../services/storage';
import * as RongImService from '../services/RongIm';
import * as MobService from '../services/MobService';

export const checkToken = createAction(types.CHECK_TOKEN, async(token)=> {
    const userLoginInfo = await userService.checkToken(token);
    const user = await userService.getUserInfo(userLoginInfo.loginname)
        .then(
            (data)=> {
                return {
                    secret: userLoginInfo,
                    publicInfo: data
                };
            }
        );
    tokenService.setToken(token);
    return user;
}, (token, resolved)=> {
    return {
        resolved: resolved,
        sync: 'user'
    }
});

export const mobLogin=createAction(types.LOGIN,async ({id,openid, nickname, sex, headimgurl})=>{
    let _userLoginInfo;
    return await userService.authRegister(id,openid, nickname, sex, headimgurl)
        .then((userInfo)=> {
            if (userInfo.result==1) {
                _userLoginInfo=userInfo.data;
                return RongImService.login(_userLoginInfo.rongToken, _userLoginInfo.loginname, _userLoginInfo.profile_image_url)
            }
            throw 'loginError'
        }).then((data)=> {
            tokenService.setToken(_userLoginInfo.accessToken);
            tokenService.setRongImken(_userLoginInfo.rongToken);
            return {
                secret: _userLoginInfo,
                publicInfo: _userLoginInfo,
                rongToken:_userLoginInfo.rongToken
            };
        });
},({resolved, rejected})=> {
    return {
        resolved:resolved ,
        rejected:rejected,
        sync: 'user'
    }
});

/*,async(name,resolved)=>{
    //console.log(resolved)
    //let {openid, nickname, gender, figureurl_qq_2, nickname, locationArr, description}=resolved;

    //return await userService.authRegister(openid, nickname, sex, headimgurl, phone_num, locationArr, description)
});*/

export const login = createAction(types.LOGIN, async(phoneNum, password)=> {
    let _userLoginInfo;
    const userLoginInfo = await userService.login(phoneNum, password)
        .then((userInfo)=> {
            if (userInfo.result==1) {
                _userLoginInfo=userInfo.data;
                return RongImService.login(_userLoginInfo.rongToken, _userLoginInfo.loginname, _userLoginInfo.profile_image_url)
            }
            throw 'loginError'
        }).then((data)=> {
            tokenService.setToken(_userLoginInfo.accessToken);
            tokenService.setRongImken(_userLoginInfo.rongToken);
            return {
                secret: _userLoginInfo,
                publicInfo: _userLoginInfo,
                rongToken:_userLoginInfo.rongToken
            };
        });
    return userLoginInfo;
}, (phone, password,rejected,resolved)=> {
    return {
        resolved: resolved,
        rejected:rejected,
        sync: 'user'
    }
});

export const updateClientUserInfo = createAction(types.UPDATE_CLIENT_USER_INFO, async(user)=> {
    return await userService.getUserInfo(user.secret.loginname)
        .then(userInfo=> {
            if (userInfo) {
                return userInfo;
            }
            throw 'getUserInfoError'
        });
}, ()=> {
    return {
        sync: 'user'
    }
});


export const getUserInfo = createAction(types.GET_USER_INFO, async(loginName)=> {
    return await userService.getUserInfo(loginName)
        .then(userInfo=> {
            if (userInfo) {
                return userInfo;
            }
            throw 'getUserInfoError'
        });
}, (userName)=> {
    return {
        userName,
        sync: 'user'
    }
});


export const logout = function () {
    return {
        type: types.LOGOUT,
        meta: {
            sync: 'user'
        }
    }
};

export const clear = function () {
    try {
        storageService.removeItem('topic');
        storageService.removeItem('message');
    }
    catch (err) {
        console.warn(err);
    }
    return {
        type: types.CLEAR
    }
};
