/**
 * Created by zack on 16/5/31.
 */
import React, {
    View,
    TouchableHighlight,
    Text,
    Component,
    StyleSheet
} from 'react-native';

import ActionSheet from '@remobile/react-native-action-sheet';
export default class AcctionSheet extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.props.show=true;
    }


    onCancel() {
        this.props.show=false;
    }

    onOpen() {
        this.props.show=true;
    }

    render() {
        return (
                <ActionSheet
                    visible={this.props.show}
                    onCancel={this.onCancel}>
                    <ActionSheet.Button>Capture</ActionSheet.Button>
                    <ActionSheet.Button>Photo</ActionSheet.Button>
                    <ActionSheet.Button>Camera</ActionSheet.Button>
                </ActionSheet>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});