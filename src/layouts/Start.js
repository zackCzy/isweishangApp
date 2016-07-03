/**
 * Created by zack on 16/6/6.
 */
import React, { Component } from 'react';
import { AppRegistry, Alert ,StyleSheet,View,Text} from 'react-native';
import AppIntro from 'react-native-app-intro';
const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        padding: 15,
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});
export default class Start extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

    onSkipBtnHandle = (index) => {
        Alert.alert('Skip');
        console.log(index);

    }
    doneBtnHandle = () => {
        Alert.alert('Done');
        this.props.onPress();
    }
    nextBtnHendle = (index) => {
        Alert.alert('Next');
        console.log(index);
    }
    onSlideChangeHandle = (index, total) => {
        console.log(index, total);
    }

    render() {
        const pageArray = [{
            title: 'Page 1',
            description: 'Description 1',
            img: 'https://goo.gl/Bnc3XP',
            imgStyle: {
                height: 80 * 2.5,
                width: 109 * 2.5,
            },
            backgroundColor: '#fa931d',
            fontColor: '#fff',
            level: 10,
        }, {
            title: 'Page 2',
            description: 'Description 2',
            img: 'https://goo.gl/GPO6JB',
            imgStyle: {
                height: 93 * 2.5,
                width: 103 * 2.5,
            },
            backgroundColor: '#a4b602',
            fontColor: '#fff',
            level: 10,
        }];
        return (
            <AppIntro
                onDoneBtnClick={this.props.onPress}
                doneBtnLabel="体验"
                skipBtnLabel=""
            >
                <View style={[styles.slide,{ backgroundColor: '#fa931d' }]}>
                    <View level={10}><Text style={styles.text}>Page 1</Text></View>
                    <View level={15}><Text style={styles.text}>Page 1</Text></View>
                    <View level={8}><Text style={styles.text}>Page 1</Text></View>
                </View>
                <View style={[styles.slide, { backgroundColor: '#a4b602' }]}>
                    <View level={-10}><Text style={styles.text}>Page 2</Text></View>
                    <View level={5}><Text style={styles.text}>Page 2</Text></View>
                    <View level={20}><Text style={styles.text}>Page 2</Text></View>
                </View>
                <View style={[styles.slide,{ backgroundColor: '#fa931d' }]}>
                    <View level={8}><Text style={styles.text}>Page 3</Text></View>
                    <View level={0}><Text style={styles.text}>Page 3</Text></View>
                    <View level={-10}><Text style={styles.text}>Page 3</Text></View>
                </View>
                <View style={[styles.slide, { backgroundColor: '#a4b602' }]}>
                    <View level={5}><Text style={styles.text}>Page 4</Text></View>
                    <View level={10}><Text style={styles.text}>Page 4</Text></View>
                    <View level={15}><Text style={styles.text}>Page 4</Text></View>
                </View>
            </AppIntro>
        );
    }
}
export const LayoutComponent = Start;


