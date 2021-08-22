import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Loader, ModalJob, CardItem} from '../../common';
import {JobDetail} from './detail';
import {
  getJobCompany,
  applyJob,
  savePost,
  getSavedPost,
} from '../../redux/actions';
import {getData} from '../../utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header, Left, Body, Button, Icon, Title} from 'native-base';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  Alert,
} from 'react-native';
class JobCompanies extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      item: null,
      role: '',
      posts: [],
      userId: '',
      isFetching: false,
    };
  }

  onRefresh = async () => {
    this.setState({isFetching: true});
    await this.props.getJobCompany(this.props.route.params.companyId);
    this.setState({isFetching: false});
  };

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  renderApply = (listApply) => {
    for (let applier of listApply) {
      if (applier.iterId === this.state.userId)
        return (
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <FontAwesome5
              name={'check-circle'}
              style={{fontSize: 15, marginTop: 2, color: 'green'}}
            />
            <Text
              style={{
                fontFamily: 'TimesNewRoman',
                marginLeft: 2,
                color: '#996f6f',
              }}>
              Applied
            </Text>
          </View>
        );
    }
  };
  renderItem = ({item}) => {
    if (item) {
      item.company = [this.props.company];
    }
    return (
      <CardItem
        item={item}
        userId={this.state.userId}
        savePost={this.savePost}
        role={this.state.role}
        showDetail={this.showDetail}
        savedPosts={this.props.savedPost}></CardItem>
    );
  };

  keyExtractor = (item) => {
    return item._id;
  };

  componentDidMount() {
    this._isMounted = true;
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getJobCompany(this.props.route.params.companyId);
      const role = await getData('role');
      const userId = await getData('userId');
      this.setState({role, userId, posts: this.props.posts});
    });

    return unsubscribe;
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  showDetail = (item) => {
    this.setModalVisible(true);
    this.setState({item});
  };

  iterApplyJob = async () => {
    if (!this.state.role) {
      Alert.alert('You must be login to apply!', `Pick your option `, [
        {
          text: 'Later',
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => {
            this.props.navigation.navigate('Login');
            this.setModalVisible(!this.state.modalVisible);
          },
        },
      ]);
      return;
    }
    await this.props.applyJob(this.state.item._id);
    this.showToast(this.props.msgApply);
  };

  savePost = async (post) => {
    if (!this.state.userId) {
      this.alertLoginSaved();
      return;
    }
    let newPost = [];
    if (!this.props.savedPost.map((e) => e.postId).includes(post._id)) {
      newPost = [...this.props.savedPost, {postId: post._id, post: [post]}];
    } else {
      this.props.savedPost.forEach((element) => {
        if (element.postId != post._id) {
          newPost.push(element);
        }
      });
    }
    await this.props.savePost(post, newPost);
  };

  alertLoginSaved = () =>
    Alert.alert('You must be login to apply!', null, [
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
  renderButtonApply = () => {
    if (this.state.role == 'iter' || !this.state.role) {
      return (
        <TouchableHighlight
          style={{...styles.openButton, backgroundColor: '#37ce3f'}}
          onPress={this.iterApplyJob}>
          <Text style={styles.textStyle}>Apply</Text>
        </TouchableHighlight>
      );
    }
    return null;
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {modalVisible, item} = this.state;

    if (this.props.status != 200 && this.props.status != 304) {
      return (
        <View>
          <Loader status={this.props.loading}></Loader>
        </View>
      );
    }
    return (
      <View>
        <Loader status={this.props.loading}></Loader>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.route.params.companyName}</Title>
          </Body>
        </Header>
        <View style={styles.container}>
          {this.state.posts.length > 0 ? (
            <FlatList
              style={styles.flatlist}
              scrollEventThrottle={16}
              data={this.props.posts}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
              onEndReached={this.handleLoadMore}></FlatList>
          ) : !this.props.loading ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // flex: 1,
                height: 500,
                padding: 20,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>
                The company does not currently have any posts. Please try again!
              </Text>
            </View>
          ) : null}
        </View>
        <ModalJob
          item={item}
          onPress={() => this.setModalVisible(!modalVisible)}
          visible={modalVisible}
          renderButtonApply={this.renderButtonApply()}></ModalJob>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getJobCompany,
  applyJob,
  savePost,
  getSavedPost,
};

const mapStateToProps = (state) => {
  const {loading, status, msg, posts, company} = state.getJobCompany;

  return {
    loading,
    posts,
    status,
    msg,
    statusApply: state.applyJob.status,
    msgApply: state.applyJob.msg,
    company,
    savedPost: _.get(state.getSavedPost, 'posts') || [],
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobCompanies);

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('10%'),
  },
  flatlist: {
    marginTop: 3,
    marginBottom: hp('8%'),
  },
  // modal

  openButton: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
