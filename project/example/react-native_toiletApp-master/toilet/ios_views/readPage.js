import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    NavigatorIOS,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

//工具类
import Uitls from '../common/utils'

//导入自定义组件
import Category from './read/category';
import List from './read/list';
import Recommend from './read/recommend';
import Search from './read/search';
import Topic from './read/topic';

//hr组件，画出一条线
class Hr extends Component {
    render() {
        "use strict";
        return (
            <View>
                <Text style={styles.hr}></Text>
            </View>
        )
    }
}

//阅读模块
class readView extends Component {

    constructor() {
        super();
        //默认不显示 ScrollView
        this.state = {
            isShow: false,
            refreshing: false
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Search navigator={this.props.navigator}/>
                <Hr/>
                {
                    this.state.isShow ?
                        <ScrollView
                            style={styles.scrollView}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    title="数据在加载中..."
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }>
                            <Topic data={this.state.recommendTopic} navigator={this.props.navigator}/>
                            <Hr/>
                            <Recommend name="热门推荐" data={this.state.hotTopic} navigator={this.props.navigator}/>
                            <Hr/>
                            <Category data={this.state.category} navigator={this.props.navigator}/>
                            <Hr/>
                            <Recommend name="轻松一刻" data={this.state.other} navigator={this.props.navigator}/>
                            <Text style={{height:70}}></Text>
                        </ScrollView >
                        :
                        (<ActivityIndicator
                            animating={true}
                            style={[{height: 80}]}
                            size="large"
                            />)
                }
            </View>
        );
    }

    //下拉刷新
    _onRefresh() {
        var that = this;
        that.setState({refreshing: true});
        setTimeout(function () {
            that._fetchData();
        }, 3000)

    }

    _fetchData(callback) {
        var that = this;
        var url = "http://123.57.39.116:3000/data/read?type=config";
        Uitls.ajax(url, function (data) {
            if (data.status === 1) {
                let obj = data.data;
                that.setState({
                    isShow: true,
                    recommendTopic: obj.recommendTopic,
                    hotTopic: obj.hotTopic,
                    category: obj.category,
                    other: obj.other,
                    refreshing: false
                });
            } else {
                alert('服务异常,正在紧急修复,请耐心等待1');
            }
        }, function (err) {
            alert('服务异常,正在紧急修复,请耐心等待2');
        })
    }

    //组件加载完毕时候调用 TODO fatch数据
    componentDidMount() {
        this._fetchData();
    }
}

//nav 组件，包裹在readview里面，对全部的信息进行路径导航
class readPage extends Component {
    render() {
        return (
            <NavigatorIOS
                initialRoute={{
                    component: readView,
                    title: '阅读',
                    navigationBarHidden:true
                }}
                style={{flex: 1}}/>
        );
    }
}

//样式表
const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    container: {
        flex: 1
    },
    text: {
        fontSize: 60,
        color: 'red',
        textAlign: 'center'
    },
    hr: {
        borderColor: "#EEE",
        borderWidth: Uitls.pixel,
        marginTop: 10,
        marginBottom: 10,
        height: Uitls.pixel
    }
});

module.exports = readPage;