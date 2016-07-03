/**
 * Created by zack on 16/6/3.
 */
import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView
} from 'react-native';
import Nav from '../components/Nav';
import CameraRollPicker from 'react-native-camera-roll-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {setImages} from '../services/token';
export default class PhotoView extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
          console.log(this.props)
          this.state={
              num:0
          }
      }
    getSelectedImages(images) {
        var num = images.length;
        this.setState({
            num:num,
            images:images
        });
    }
    _sendPhoto(){
        if(this.state.num<=0){
            alert("你还没选择图片");
            return false;
        }
        const {router} =this.props;
        this.props._getPhoto(this.state.images);
        router.pop();

    }
    render(){
        const {router}=this.props
        const navs={
            Left: {
                text: <Icon
                    name='md-close'
                    size={43}
                    color='rgba(255,255,255,0.9)'
                    style={[{fontSize:22,borderRadius:50,borderWidth:2,borderColor:"#fff"}]}
                />,
                onPress: ()=> {

                    router.pop();
                }
            },
            Center: {
                text: '图片'
            },
            Right:{
                text:'完成('+this.state.num+'/9)',
                onPress:this._sendPhoto.bind(this)
            }
        }
        let _me=this;
        return (
            <View style={styles.container}>

                <ScrollView>
                    <CameraRollPicker
                        groupTypes='SavedPhotos'
                        batchSize={25}
                        maximum={15}
                        assetType='Photos'
                        imagesPerRow={3}
                        imageMargin={5}
                        callback={this.getSelectedImages.bind(this)} />
                </ScrollView>
                <Nav navs={navs} style={{height:55,paddingTop:0}}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    }
});
export const LayoutComponent = PhotoView;
