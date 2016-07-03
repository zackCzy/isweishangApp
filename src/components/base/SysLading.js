/**
 * Created by zack on 16/7/1.
 */
import Loading from 'react-native-loading-w';
import {Component} from 'react';
export default class SysLading extends Component{
    //view
    render() {
        return (
            <View>
                <Text>test loading</Text>
                <Loading ref={'loading'} text={'Loading...'} />
            </View>
        );
    }
    getLoading() {
        return this.refs['loading'];
    }
}
