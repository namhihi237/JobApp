import React, {Component} from 'react';
import {SearchBar} from 'react-native-elements';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import {getJob} from '../../redux/actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Job extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
  };

  updateSearch = (search) => {
    this.setState({search});
  };

  renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.text}>Company Name: {item.companyName}</Text>
      <Text style={styles.text}>Address: {item.address}</Text>
      <Text style={styles.text}>Description: {item.description}</Text>
      <Text style={styles.text}>Salary: {item.salary}</Text>
      <Text style={styles.text}>Skill: {item.skill.join(', ')}</Text>
      <Text style={styles.text}>Position: {item.position.join(', ')}</Text>
      <Text style={styles.text}>End time: {item.endTime}</Text>
      <TouchableOpacity>
        <Text style={{color: 'green'}}>Detail</Text>
      </TouchableOpacity>
    </View>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  showDetail = () => {};

  async componentDidMount() {
    await this.props.getJob();
    console.log(this.props.posts);
  }
  render() {
    const {search} = this.state;

    if (this.props.status != 200 && this.props.status != 304) {
      this.showToast(this.props.msg);
      return (
        <View>
          <Text>No data</Text>
        </View>
      );
    }
    return (
      <View>
        <Loader status={this.props.loading}></Loader>
        <SafeAreaView>
          <SearchBar
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={search}
            placeholderTextColor="#aa5f5f"
            showLoading={true}
          />
          <FlatList
            style={styles.flatlist}
            data={this.props.posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}></FlatList>
        </SafeAreaView>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getJob,
};

const mapStateToProps = (state) => {
  const {loading, posts, status, msg} = state.getJob;
  return {
    loading,
    posts,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Job);

const styles = StyleSheet.create({
  flatlist: {
    // backgroundColor: '#003f5c',
    marginTop: 1,
  },
  item: {
    height: (windowHeight - 10) / 4,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#DF2455',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
  },
  text: {
    fontSize: 15,
    // fontWeight: 'bold',
  },
});
