import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Loader} from '../../common';
import axios from 'axios';
import {apiUrl} from '../../api/api';
import {getCompanies} from '../../redux/actions';
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
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    await this.props.getCompanies();
    this.setState({companies: this.props.companies, page: 1});
    this.setState({isFetching: false});
  };

  updateSearch = (search) => {
    this.setState({search});
  };

  searchItem = async () => {
    if (this.state.search == '') return;
    this.props.navigation.navigate('Search', {search: this.state.search});
  };

  moveToListJobs = async (companyId, companyName) => {
    this.props.navigation.navigate('ListJobs', {companyId, companyName});
  };

  async componentDidMount() {
    this.setState({search: ''});
    await this.props.getCompanies();
    this.setState({companies: this.props.companies, page: 1});
  }

  keyExtractor = (item) => {
    return item._id;
  };

  async handleLoadMore() {
    try {
      let page = this.state.page + 1;
      await this.setState({isLoading: true, page});

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

  renderItem = ({item}) => (
    <View style={styles.item}>
      <View style={styles.logoContainer}>
        <Image source={{uri: _.get(item, 'image')}} style={styles.logo}></Image>
        <View style={{padding: 1, marginLeft: 10, maxWidth: wp('60%')}}>
          <Text
            style={{...styles.text, fontSize: hp('2.5%')}}
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
              <Text style={{color: 'green'}}>
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
      <View style={{flex: 1}}>
        {this.state.isLoading && (
          <View>
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  };
  render() {
    return (
      <View>
        <Loader status={this.props.loading}></Loader>
        <View style={styles.container}>
          <View style={styles.searchContaier}>
            <View style={{...styles.searchInput}}>
              <TextInput
                style={{
                  height: 50,
                  width: wp('75%'),
                  fontFamily: 'TimesNewRoman',
                  fontSize: 16,
                }}
                onChangeText={this.updateSearch}
                value={this.state.search}
                placeholder="Company name..."
                placeholderTextColor="#44464f"></TextInput>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={this.searchItem}>
                <FontAwesome5
                  name={'search'}
                  style={{fontSize: 22, marginTop: 2}}
                />
              </TouchableOpacity>
            </View>
          </View>
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
};

const mapStateToProps = (state) => {
  const {loading, status, msg} = state.getCompanies;
  return {
    loading,
    status,
    msg,
    currentPage: _.get(state.getCompanies, 'data.scurrentPage') || null,
    numPages: _.get(state.getCompanies, 'data.numPages') || null,
    companies: _.get(state.getCompanies, 'data.result') || [],
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Companies);

const styles = StyleSheet.create({
  container: {
    height: windowHeight - 26,
  },
  searchContaier: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
    backgroundColor: 'rgba(249, 247, 247, 0.1)',
  },
  searchInput: {
    height: 50,
    width: windowWidth - 10,
    borderColor: '#7e8591',
    marginLeft: 3,
    marginRight: 3,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    paddingLeft: 15,
    borderRadius: 50,
    backgroundColor: '#c7cadd',
    opacity: 0.7,
  },
  searchButton: {
    height: 40,
    width: windowWidth * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    marginTop: 3,
    marginBottom: hp('8%'),
    paddingBottom: 100,
    paddingTop: 10,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
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
  iconText: {marginTop: 4, marginLeft: 5},
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
});
