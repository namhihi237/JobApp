import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Loader, Header} from '../../common';
import axios from 'axios';
import {apiUrl} from '../../api/api';
import {notifications} from '../../redux/actions';
import Card from './Card';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {getData} from '../../utils';
const {BASE_URL} = apiUrl;
class Notification extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      item: null,
      notifications: [],
      page: 1,
      isLoading: false,
      isFetching: false,
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    await this.props.notifications();
    this.setState({notifications: this.props.listNotifications, page: 1});
    this.setState({isFetching: false});
  };

  renderItem = ({item}) => <Card item={item}></Card>;

  keyExtractor = (item) => {
    return item._id;
  };

  async componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.notifications();
      this.setState({notifications: this.props.listNotifications, page: 1});
    });
    return unsubscribe;
  }

  async handleLoadMore() {
    try {
      await this.setState({page: this.state.page + 1, isLoading: true});

      if (this.state.page > this.props.numPages) {
        return;
      }
      const token = await getData('token');
      const result = await axios.get(
        `${BASE_URL}/api/v1/notifications?page=${this.state.page}&take=${10}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      const addPost = result.data.data.notifications;
      const currentPage = result.data.data.currentPage;
      let newPost = [...this.state.notifications, ...addPost];
      this.setState({
        notifications: newPost,
        isLoading: false,
        page: currentPage + 1,
      });
    } catch (error) {
      return;
    }
  }

  footerList = () => {
    return (
      <View style={{flex: 1}}>
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  render() {
    if (this.props.status != 200 && this.props.status != 304) {
      return (
        <View>
          <Loader status={this.props.loading}></Loader>
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <Loader status={this.props.loading}></Loader>
        <Header
          title={'    Notification'}
          left={false}
          hideRight={true}
          color="#0E1442"
        />
        <FlatList
          style={styles.flatList}
          scrollEventThrottle={16}
          data={this.state.notifications}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReached={this.handleLoadMore}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          ListFooterComponent={this.footerList}></FlatList>
      </View>
    );
  }
}
const mapDispatchToProps = {
  notifications,
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.notifications;
  return {
    loading,
    listNotifications: _.get(state.notifications, 'data.notifications') || [],
    status,
    msg,
    currentPage: _.get(state.notifications, 'data.currentPage') || null,
    numPages: _.get(state.notifications, 'data.numPages') || null,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Notification);

const styles = StyleSheet.create({
  flatList: {
    marginBottom: hp('1%'),
    marginTop: hp('1%'),
  },
});
