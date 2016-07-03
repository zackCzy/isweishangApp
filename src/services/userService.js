import * as requestService from './request';

export function sendCode(phoneNum){
	return requestService.post("/sendPhoneCode.do",{
		phoneNum:phoneNum
	});
}

export function authRegister(name,openid, nickname, sex, headimgurl){
	const body = {
		authId: name,
		openid: openid,
		nickname: nickname,
		sex:sex,
		headimgurl: headimgurl
	};
	return requestService.post("/authRegister.do",body);
}
export function register(account,code,password){
	return requestService.post("/register.do",{
		account:account,
		code:code,
		password:password
	});
}

export function checkToken(token) {
	return requestService.post('/accesstoken', {
			accesstoken: token
		})
		.then(data => {
			if (data.success) {
				data.token = token;
				return data
			}
			throw 'wrong token'
		});
}

export function login(phoneNum, password) {
	return requestService.post('/login.do', {
		account: phoneNum,
		password: password
	});
}
export function getUserInfo(userLoginName) {
	return requestService.get('/user/' + userLoginName)
		.then((data)=>data.data);
}
