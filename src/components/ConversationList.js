import React ,{PropTypes,Component}from 'react';
import {
    StyleSheet,
    Dimensions,
    ListView,
    RefreshControl,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,
    Image,
    Platform,
    NativeModules
} from 'react-native';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from './../components/base/Spinner';
import * as Constants from '../constants';
import moment from 'moment';
const {height, width} = Dimensions.get('window');
import ResponsiveImage from 'react-native-responsive-image';
import Badge from '../components/Badge';

export default class ConversationList extends Component {
    static propTypes = {
        onPress: PropTypes.func
    };

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds: ds.cloneWithRows(props.data || [])
        };

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                ds: this.state.ds.cloneWithRows(nextProps.data || [])
            });
        }
    }


    renderRow(conver, sid, index) {
        let userId = this.props.userId == conver.senderUserId ? conver.targetId : conver.senderUserId;
        let date = moment(conver.sendTime+1464590458438).startOf('minute').fromNow();
        return (
            <TouchableOpacity
                onPress={()=>{this.props.onPress(conver,index,userId)}}
            >
                <View>
                    <View style={ styles.row }>
                        <View style={styles.imgWrapper}>
                            <ResponsiveImage
                                ref={view => this.imgView=view}
                                style={styles.img}
                                source={{uri:conver.protraitUrl||'http://avatar.csdn.net/A/F/E/1_baodongsheng2011.jpg'}}/>
                            {conver.unreadMessageCount>0?
                                <Badge style={styles.dar}>
                                    {conver.unreadMessageCount}
                                </Badge> :null
                            }
                        </View>

                        <View style={[styles.topic]}>
                            <View style={{flex:0.8,flexDirection:"row",alignItems:"center"}}>
                                <Text
                                    ref={view => this.titleText=view}
                                    numberOfLines={1}
                                    style={[styles.title,{flex:0.8}]}>
                                    { conver.senderUserName}
                                </Text>
                            </View>
                            <View style={[styles.topicFooter]}>
                                <Text>{conver.content}</Text>
                                <Text
                                    key='dateText'
                                    style={[styles['topicFooter text'],styles['topicFooter date']]}>
                                    {date}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const {actions,tab} = this.props;
        return (
            <ListView
                showsVerticalScrollIndicator
                removeClippedSubviews
                enableEmptySections
                name={tab}
                ref={view => {this._listView = view}}
                initialListSize={10}
                pagingEnabled={false}
                scrollRenderAheadDistance={90}
                dataSource={this.state.ds}
                renderRow={this.renderRow.bind(this)}
                onEndReachedThreshold={30}
                refreshControl={
						<RefreshControl
							ref={(view)=> this.refreshControl=view}
							refreshing={true}
							onRefresh={()=>{
								actions.getRongiMList();
							}}
							{...Constants.refreshControl}
						  />
					}
            />
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width
    },
    "row": {
        "flexDirection": "row",
        "borderBottomColor": "rgba(0, 0, 0, 0.02)",
        "borderBottomWidth": 1,
        "paddingTop": 10,
        "paddingRight": 0,
        "paddingBottom": 10,
        "paddingLeft": 10,
        height: 60
    },
    "imgWrapper": {
        "width": 60,
        "position": "absolute",
        "left": 10,
        "top": 10,
        "height": 60
    },
    "img": {
        "height": 40,
        "width": 40,
        "borderRadius": 20
    },
    "topic": {
        "marginLeft": 60,
        width: width - 100
    },
    "title": {
        "fontSize": 15
    },
    "topicFooter": {
        "marginTop": 12,
        "flexDirection": "row"
    },
    "topicFooter text": {
        "fontSize": 11,
        "color": "rgba(0, 0, 0, 0.5)"
    },
    "topicFooter date": {
        "position": "absolute",
        "right": 0,
        "top": 0
    },
    "topicFooter count": {
        "marginRight": 15
    },
    "topicFooter top": {
        "fontSize": 11,
        "marginTop": 1,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 10,
        "color": "#E74C3C"
    },
    "topicFooter good": {
        "fontSize": 11,
        "marginTop": 1,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 10,
        "color": "#2ECC71"
    },
    "topicFooter tab": {
        "fontSize": 11,
        "marginTop": 1,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 10
    },
    "loading": {
        "marginTop": 250
    },
    footerErrorText: {
        fontSize: 20,
        textAlign: 'center',
        flex: 1
    },
    footerError: {
        height: 76,
        width: width,
        flexDirection: 'column'
    },
    reachedEndLoading: {
        paddingTop: 20,
        paddingBottom: 20
    },
    dar: {
        position: "absolute",
        borderRadius: 15,
        width: 20,
        height: 20,
        textAlign: "center",
        lineHeight: 20,
        backgroundColor: "#f00",
        fontSize: 12,
        color: "#fff",
        left: 25,
        top: -5
    }
});


