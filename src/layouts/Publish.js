import React,{Component,PropTypes} from 'react';

import  {
    View,
    Text,
    StyleSheet,
    PickerIOS,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    DeviceEventEmitter,
    LayoutAnimation,
    Picker,
    Platform,
    Image,
    NativeModules,
} from 'react-native';
import _ from 'lodash';
import ResponsiveImage from 'react-native-responsive-image';
import Icon from 'react-native-vector-icons/Ionicons';
import Nav from '../components/Nav';
import Modal from '../components/base/Modal';
import Loading from '../components/base/Loading';
import config from '../configs/index';
import animations from '../configs/animations';
import {upload} from '../services/QiniuService';
import Lightbox from 'react-native-lightbox';
import ImageResizer from 'react-native-image-resizer';

const {ImagePickerManager}=NativeModules;
const {width, height} = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 0 : 20;
const PickerItemIOS = PickerIOS.Item;
let imageMargin = 3;
let imagesPerRow = 5;
let imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;

class Publish extends Component {
    constructor(props) {
        super(props);
        this.tabs = {
            buy: '我要买',
            sell: '我要卖',
            live: '开直播'
        };
        this.state = {
            selectTab: 'share',
            isPickerShow: false,
            dirty: false,
            images: [],
            isPublishing: false
        };
        this.imageDom=[];
        this.typeObj = {
            buy: {
                title: "我要买",
                titlePlaceholder: "我想买……",
                contentPlaceholder: "请描述你想买商品的详细描述"
            },
            sell: {
                title: "我想卖",
                titlePlaceholder: "我想卖……",
                contentPlaceholder: "请描述你想卖商品的详细描述"
            },
            live: {
                title: "创建直播",
                titlePlaceholder: "我想买……",
                contentPlaceholder: "请描述你想买商品的详细描述"
            }
        }
        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    }


    updateKeyboardSpace(e) {
        LayoutAnimation.configureNext(animations.keyboard.layout.spring);
        this.commentsView && this.commentsView.setNativeProps({
            style: {
                height: contentHeight - e.endCoordinates.height
            }
        })
    }

    resetKeyboardSpace() {
        LayoutAnimation.configureNext(animations.keyboard.layout.spring);
        this.commentsView && this.commentsView.setNativeProps({
            style: {
                height: contentHeight
            }
        })
    }


    componentDidMount() {
        DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
        DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
    }


    _blur() {
        this.titleInput.blur();
        this.contentInput.blur()
    }

    _uuid(){
        return new Date().getTime()+Math.random()*1000000;
    }
    _validateForm() {
        if (!this.titleInputValue || this.titleInput == '') {
            return window.alert('标题不能为空!')
        }

        if (!this.contentInputValue || this.contentInput == '') {
            return window.alert('你还没写东西呢!')
        }

        if (this.titleInputValue.length <= 10) {
            return window.alert('标题字数必须在10字以上!')
        }

        return true
    }


    _resizedImage(image) {

        return new Promise((resolve, reject)=>{
            Image.getSize(image,(width,height)=>{
                resolve({
                    width:width,
                    height:height
                });
            },(err)=>{
                reject(err);
            })
        }).then((data)=>{
            let {width,height}=data;
            return ImageResizer.createResizedImage(image,width , height, 'JPEG', 1).then((resizedImageUri) => {
                let _resizedImageUri = resizedImageUri;
                return upload(_resizedImageUri, (new Date().getTime()+Math.random()*1000000)+".jpg");
            }).then((response)=> {
                return response.json();
            });
        });
    }

    _submit() {
        const {actions, publishPending, router} = this.props;
        if (this.state.isPublishing || !this._validateForm()) return;
        const _me = this;
        this.setState({
            isPublishing: true
        });
        (async (images)=> {
            let _images = [];
            let count=0;
            try {
                for (var item of images) {
                    await _me._resizedImage(item,count).then((json)=> {
                        _images.push("http://o6p1gmikq.bkt.clouddn.com/" + json.key);
                    });
                    ++count;
                }
                await actions.publish({
                    title: _me.titleInputValue,
                    tab: _me.props.type,
                    content: _me.contentInputValue,
                    images: _images,
                    resolved: ()=> {
                        _me.setState({
                            isPublishing: false
                        });
                        actions.toast('发布成功!');
                        router.pop();
                    },
                    rejected: ()=> {
                        _me.setState({
                            isPublishing: false
                        });
                        actions.toast('发布失败');
                    }
                });
            } catch (err) {
                actions.toast('发布失败');
                _me.setState({
                    isPublishing: false
                });
            }

        })(this.state.images);
    }

    _selectPhotoTapped() {
        const options = {
            title: '选择图片',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '图片',
            cancelButtonTitle: "取消",
            quality: 0.5,
            maxWidth: 300,
            maxHeight: 300,
            storageOptions: {
                skipBackup: true
            },
            allowsEditing: true
        };

        ImagePickerManager.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either:
                //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                var source;
                if (Platform.OS === 'android') {
                    source = {uri: response.uri, isStatic: true};
                } else {
                    source = {uri: response.uri.replace('file://', ''), isStatic: true};
                }

                this.setState({
                    avatarSource: source
                });
            }
        });
    }

    _onPickerPress() {
        this.setState({
            isPickerShow: true,
            dirty: true
        });
        this._blur()
    }


    _onPickerValueChange(tab) {
        this.setState({
            selectTab: tab
        })
    }


    _renderPickerContent() {
        return Object.keys(this.tabs).map(tab=> {
            return (
                <Picker.Item
                    key={tab}
                    value={tab}
                    label={this.tabs[tab]}
                />
            )
        })
    }


    _renderPicker() {
        if (Platform.OS === 'ios') {
            return (
                <TouchableOpacity
                    onPress={this._onPickerPress.bind(this)}
                >
                    <View style={styles.row}>
                        <Icon
                            name={'ios-keypad'}
                            size={24}
                            color='#1ABC9C'
                            style={[styles.selectorIcon, styles.labelIcon]}
                            onPress={this._selectPhotoTapped.bind(this)}
                        />

                        <Text style={styles.tabSelectorText}>
                            {this.state.dirty ? this.tabs[this.state.selectTab] : '请选择板块'}
                        </Text>

                        <Icon
                            name={'ios-arrow-right'}
                            size={24}
                            color='rgba(0,0,0,0.35)'
                            style={styles.selectorIcon}
                        />
                    </View>
                </TouchableOpacity>
            );
        }

        else {
            return (
                <View style={styles.row}>
                    <Icon
                        name={'ios-keypad'}
                        size={24}
                        color='#1ABC9C'
                        style={[styles.selectorIcon, styles.labelIcon]}
                    />

                    <Picker
                        style={styles.pickerAndroid}
                        selectedValue={this.state.selectTab}
                        onValueChange={this._onPickerValueChange.bind(this)}>
                        {this._renderPickerContent()}
                    </Picker>
                </View>
            )
        }
    }

    _getPhoto(images) {
        this.setState({
            images: images
        });
    }

    _deletePhoto(image) {
        let _me = this;
        this.state.images.forEach(function (item, i) {
            if (image == item) {
                _me.setState({
                    images: _me.state.images.splice(i, 1)
                });
                return false;
            }
        });
    }

    renderCarousel(images) {
        return (

            <ResponsiveImage
                style={{flex: 1}}
                resizeMode="contain"
                source={{ uri:images}}
            />

        );
    }

    render() {
        const {router, publishPending,type} = this.props;
        this.props._getPhoto = this._getPhoto.bind(this);
        let time = new Date().getTime() + Math.random() * 10;
        const _me = this;
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
                    this._blur()
                }
            },
            Center: {
                text: this.typeObj[type].title
            },
            Right: {
                text: <Icon
                    name='ios-information-circle'
                    size={40}
                    color='rgba(255,255,255,0.9)'
                    style={[{fontSize:22,borderRadius:50,borderWidth:2,borderColor:"#fff"}]}
                />
            }

        };

        const modal = (
            <Modal
                onPressBackdrop={()=>{
						this.setState({
							isPickerShow: false
						});
					}}
                style={styles.modal}
            >
                <View style={styles.pickerIOS}>
                    <Picker
                        mode="dropdown"
                        selectedValue={this.state.selectTab}
                        onValueChange={this._onPickerValueChange.bind(this)}>
                        {this._renderPickerContent()}
                    </Picker>
                </View>
            </Modal>
        );

        return (
            <View style={styles.container}>
                <Nav
                    navs={navs}
                />
                <View style={styles.row}>
                    <Icon
                        name={'ios-send'}
                        size={24}
                        color='#1ABC9C'
                        style={[styles.selectorIcon, styles.labelIcon]}
                    />

                    <TextInput
                        ref={view=>this.titleInput=view}
                        placeholder={this.typeObj[type].titlePlaceholder}
                        style={styles.titleInput}
                        onChangeText={(text) => {
                                this.titleInputValue = text
                            }}
                        underlineColorAndroid={'#00000000'}
                    />
                </View>

                <TextInput
                    ref={view=>this.contentInput=view}
                    style={[styles.topicContent]}
                    multiline={true}
                    onChangeText={(text) => {
                        this.contentInputValue = text
                    }}
                    blurOnSubmit={true}
                    placeholder={this.typeObj[type].contentPlaceholder}
                    underlineColorAndroid={'#00000000'}
                />
                <View style={[ styles.imageContainer, { padding: imageMargin, paddingRight: 0, }, ]}>
                    { this.state.images.map((image,index) => {
                        return (
                            <TouchableOpacity
                                key={image}
                                style={{ position: 'relative', marginBottom: imageMargin, }}
                            >
                                <Lightbox swipeToDismiss={false} renderContent={()=>_me.renderCarousel(image)}>
                                    <ResponsiveImage
                                        style={{marginRight: imageMargin,}} source={{ uri: image }}
                                                     initWidth={imageSize} initHeight={imageSize}/>
                                </Lightbox>
                                <Icon
                                    name={'ios-close-circle'}
                                    size={29}
                                    color='#f13'
                                    style={[ styles.checkIcon, {right: imageMargin } ]}
                                    onPress={()=>{this._deletePhoto(image)}}
                                />
                            </TouchableOpacity>
                        );
                    })
                    }
                </View>
                <View style={styles.bottomBtnWrap}>
                    <View
                        style={styles.bottomLeftWrap}>
                        <Icon
                            name={'logo-instagram'}
                            size={24}
                            color='#1ABC9C'
                            style={[styles.selectorIcon, styles.labelIcon]}
                            onPress={()=>{router.toPhoto({
                                _getPhoto:this._getPhoto.bind(this)
                            })}}
                        />
                        <Icon
                            name={'md-mic'}
                            size={24}
                            color='#1ABC9C'
                            style={[styles.selectorIcon, styles.labelIcon]}
                            onPress={this._selectPhotoTapped.bind(this)}
                        />
                        <Icon
                            name={'logo-instagram'}
                            size={24}
                            color='#1ABC9C'
                            style={[styles.selectorIcon, styles.labelIcon]}
                            onPress={()=>{router.toQRCode()}}
                        />
                    </View>
                    <View
                        style={[styles.bottomLeftWrap,{justifyContent: "flex-end",paddingRight:10}]}>
                        <Icon.Button onPress={()=> this._submit()} name="ios-checkmark-circle-outline"
                                     backgroundColor="rgb(205,88,80)">
                            发布
                        </Icon.Button>
                    </View>
                </View>
                {this.state.isPickerShow && modal}
                <Loading show={publishPending}/>
            </View>
        )
    }
}

//{this._renderPicker()}
const textColor = 'rgba(0,0,0,0.7)';
const contentHeight = height - 51 * 2 - Nav.navHeight;

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        backgroundColor: 'white'
    },
    row: {
        height: 51,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: 'rgba(0,0,0,0.03)',
        borderBottomWidth: 1,
        paddingLeft: 10
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
        paddingLeft: 15,
        height: 200
    },
    topicContent: {
        textAlign: "left", textAlignVertical: "top",
        paddingTop: 20,
        paddingLeft:10,
        paddingRight:10,
        fontSize: 25,
        flex: 0.3,
    },
    modal: {
        flexDirection: 'row',
        alignItems: 'flex-end',
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
    imageContainer: {
        paddingTop: 10,
        flex: 0.3,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    checkIcon: {
        position: 'absolute',
        top: 5,
        backgroundColor: 'transparent',
    },
    bottomBtnWrap: {
        height: 55, backgroundColor: "#ccc", flexDirection: 'row', marginBottom: statusBarHeight
    },
    bottomLeftWrap: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        alignItems: "center"
    }
});


export const LayoutComponent = Publish;
export function mapStateToProps(state) {
    return {
        ...state.topicUI
    };
}


