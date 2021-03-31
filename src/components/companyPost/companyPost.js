import React, {Component} from 'react';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {getCompanyPost} from '../../redux/actions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CompanyPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAccept: [],
      dataWait: [],
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  renderItemAccept = ({item, index, separators}) => (
    <TouchableOpacity
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text}>Company Name: {item.companyName}</Text>
        <Text style={styles.text}>Salary: {item.salary}</Text>
        <Text style={styles.text}>Skill: {item.skill.join(', ')}</Text>
        <Text style={styles.text}>Position: {item.position.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  renderItemWait = ({item, index, separators}) => (
    <TouchableOpacity
      onPress={() => Alert.alert('ok')}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}>
      <View style={styles.item}>
        <Text style={styles.text}>Company Name: {item.companyName}</Text>
        <Text style={styles.text}>Salary: {item.salary}</Text>
        <Text style={styles.text}>Skill: {item.skill.join(', ')}</Text>
        <Text style={styles.text}>Position: {item.position.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  keyExtractor = (item) => {
    return item._id;
  };

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getCompanyPost();
      this.showToast(this.props.msg);
      console.log('status ', this.props.status);
      this.setState({
        dataWait: this.props.posts.filter((e) => e.accept == false),
        dataAccept: this.props.posts.filter((e) => e.accept == true),
      });
    });

    return unsubscribe;
  }

  moveToCreatePost = () => {
    this.props.navigation.navigate('CreatePost');
  };

  render() {
    const {dataAccept, dataWait} = this.state;
    if (this.props.status != 200 && this.props.status != 304) {
      return (
        <View>
          <Text>No data</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Loader status={this.props.loading}></Loader>
        <View>
          <Text style={styles.titleList}>Accepted post list</Text>
          <FlatList
            horizontal={true}
            data={dataAccept}
            renderItem={this.renderItemAccept}
            keyExtractor={this.keyExtractor}
          />
        </View>
        <View style={styles.line} />
        <View>
          <Text style={styles.titleList}>Waiting post list</Text>
          <FlatList
            horizontal={true}
            data={dataWait}
            renderItem={this.renderItemWait}
            keyExtractor={this.keyExtractor}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={this.moveToCreatePost}>
          <Text style={styles.textAdd}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getCompanyPost,
};

const mapStateToProps = (state) => {
  const {loading, posts, status, msg} = state.getCompanyPost;

  return {
    loading,
    posts,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CompanyPost);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#b8c2d1',
    width: 200,
    height: 150,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
  },
  line: {
    height: 1,
    backgroundColor: 'black',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 10,
  },
  titleList: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonAdd: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: '#ee6e73',
    borderRadius: 100,
  },
  textAdd: {
    fontSize: 30,
    fontWeight: '900',
  },
});
