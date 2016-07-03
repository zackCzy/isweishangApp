/**
 * Created by zack on 16/6/3.
 */
import qiniu from 'react-native-qiniu';
import config from '../configs/index';
qiniu.conf.ACCESS_KEY =config.qiniuAk;
qiniu.conf.SECRET_KEY = config.qiniuSk;
const bucket = config.bucket;


export function upload(imageUrl,imagesToken,callback){

    var putPolicy = new qiniu.auth.PutPolicy2(
        {scope: bucket+":"+imagesToken}
    );
    var uptoken = putPolicy.token();

    return qiniu.rpc.uploadImage(imageUrl, imagesToken, uptoken);
}


