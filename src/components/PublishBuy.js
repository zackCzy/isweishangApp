/**
 * Created by zack on 16/6/3.
 */
import React,{Component} from 'react';
import {
    ScrollView,
    View,
    TextInput,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from './base/Loading';

export default class PublishBuy extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

    render(){
        return (
            <ScrollView>
                <View style={styles.row}>
                    <Icon
                        name={'ios-bolt'}
                        size={24}
                        color='#1ABC9C'
                        style={[styles.selectorIcon, styles.labelIcon]}
                    />

                    <TextInput
                        ref={view=>this.titleInput=view}
                        placeholder='请输入标题'
                        style={styles.titleInput}
                        onChangeText={(text) => {
                                this.titleInputValue = text
                            }}
                    />
                </View>
            </ScrollView>
        )
    }
}

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
        borderBottomWidth: 1
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
    }
});

