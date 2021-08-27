import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Loader, SearchBar } from '../../common';
import axios from 'axios';
import { apiUrl } from '../../api/api';
import FollowButton from './followButton';
import { getData } from '../../utils';
import { getCompanies, follow, getFollowing } from '../../redux/actions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get('window').width;

class Companies extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: '',
      companies: [],
      isFetching: false,
      isLoading: false,
      following: [],
      role: '',
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  onRefresh = async () => {
    this.setState({ isFetching: true });
    await this.props.getCompanies();

    this.setState({ companies: this.props.companies, page: 1 });
    this.setState({ isFetching: false });
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  searchItem = async () => {
    if (this.state.search == '') return;
    this.props.navigation.navigate('Search', { search: this.state.search });
  };

  moveToListJobs = async (companyId, companyName) => {
    this.props.navigation.navigate('ListJobs', { companyId, companyName });
  };

  async componentDidMount() {
    this.setState({ search: '' });
    await this.props.getCompanies();
    const token = await getData('token');
    const role = await getData('role');
    let following = [];
    if (token && role == 'iter') {
      await this.props.getFollowing();
      following = this.props.following;
    }
    this.setState({
      companies: this.props.companies,
      page: 1,
      following,
      role,
    });
  }

  keyExtractor = (item) => {
    return item._id;
  };

  async handleLoadMore() {
    try {
      let page = this.state.page + 1;
      await this.setState({ isLoading: true, page });

      if (page > this.props.numPages) {
        return;
      }

      const result = await axios.get(
        `${apiUrl.BASE_URL}/api/v1/companies/info?page=${page}&take=${10}`,
      );
      this.setState({
        companies: [...this.state.companies, ...result.data.data.result],
        page,
        isLoading: false,
      });
    } catch (error) {
      return;
    }
  }

  follow = async (companyId) => {
    try {
      const token = await getData('token');
      if (!token) {
        Alert.alert('You must be login to follow!', null, [
          {
            text: 'Later',
            style: 'cancel',
          },
          {
            text: 'Login now',
            onPress: () => {
              this.props.navigation.navigate('Login');
            },
          },
        ]);
        return;
      }
      if (!this.state.following.includes(companyId)) {
        this.setState({ following: [...this.state.following, companyId] });
      } else {
        let index = this.state.following.indexOf(companyId);
        let newFollow = this.state.following;
        newFollow.splice(index, 1);
        this.setState({ following: newFollow });
      }
      await this.props.follow({ companyId });
    } catch (error) {
      return;
    }
  };

  renderFollow = (accountId) => {
    if (this.state.role == 'iter' || !this.state.role) {
      return (
        <FollowButton
          isFollow={this.state.following.includes(accountId)}
          onPress={() => this.follow(accountId)}></FollowButton>
      );
    }
    return null;
  };
  renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.logoContainer}>
        <FastImage
          style={styles.logo}
          source={{
            uri: _.get(item, 'image'),
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={{ padding: 1, marginLeft: 10, maxWidth: wp('60%') }}>
          <View style={styles.follow}>{this.renderFollow(item.accountId)}</View>
          <Text
            style={{ ...styles.text, fontSize: hp('2.5%') }}
            numberOfLines={2}
            ellipsizeMode="tail">
            {_.get(item, 'name')}
          </Text>
          <View style={styles.fiedlsText}>
            <FontAwesome5 name={'map-marker-alt'} style={styles.iconText} />
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              {item.address}
            </Text>
          </View>
          <View style={styles.seeMore}>
            <TouchableOpacity
              onPress={() =>
                this.moveToListJobs(item.accountId, _.get(item, 'name'))
              }>
              <Text style={{ color: 'green' }}>
                {_.get(item, 'recruitingPost')} Jobs
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
  footerList = () => {
    return (
      <View style={{ flex: 1 }}>{this.state.isLoading && <View></View>}</View>
    );
  };
  render() {
    return (
      <View>
        <Loader status={this.props.loading}></Loader>
        <View style={styles.container}>
          <SearchBar
            onPress={this.searchItem}
            onChangeText={this.updateSearch}
            value={this.state.search}
            placeholder={'Company name...'}
          />
          <FlatList
            style={styles.flatlist}
            scrollEventThrottle={16}
            data={this.state.companies}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            onEndReached={this.handleLoadMore}
            ListFooterComponent={this.footerList}></FlatList>
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getCompanies,
  follow,
  getFollowing,
};

const mapStateToProps = (state) => {
  const { loading, status, msg } = state.getCompanies;
  return {
    loading,
    status,
    msg,
    currentPage: _.get(state.getCompanies, 'data.scurrentPage') || null,
    numPages: _.get(state.getCompanies, 'data.numPages') || null,
    companies: _.get(state.getCompanies, 'data.result') || [],
    following: _.get(state.getFollowing, 'following') || [],
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Companies);

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('10%'),
  },
  flatlist: {
    marginTop: 3,
    marginBottom: hp('12%'),
  },
  item: {
    height: hp('90%') / 5,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,

    backgroundColor: '#fff',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 15,
    paddingRight: 10,
    justifyContent: 'center',
    borderRadius: 7,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    marginTop: 25,
    width: 80,
    height: 80,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fiedlsText: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconText: { marginTop: 4, marginLeft: 5 },
  seeMore: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (windowWidth * 1.8) / 3,
    marginTop: 10,
    marginLeft: 5,
  },
  text: {
    marginBottom: 1,
    marginLeft: 5,
    fontFamily: 'TimesNewRoman',
    fontSize: hp('2.1%'),
  },
  follow: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});
