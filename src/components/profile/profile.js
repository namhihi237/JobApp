import React, {Component} from 'react';
import {Loader} from '../../common';
import {Avatar} from 'react-native-elements';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {getProfile} from '../../redux/actions/getProfile';
import {Toast} from 'native-base';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  showToast = (msg) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
    });
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getProfile();
    });
    return unsubscribe;
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          {/* <Loader status={this.props.loading}></Loader> */}
          <View>
            <Text style={styles.titleList}>PROFILE</Text>
            <View style={styles.cv}>
              <View style={styles.imgContainer}>
                <Avatar
                  // style={styles.tinyLogo}
                  containerStyle={{marginLeft: 10, marginTop: 15}}
                  activeOpacity={0.7}
                  rounded
                  size="xlarge"
                  source={{
                    uri:
                      _.get(this.props.cv, 'image') ||
                      'https://res.cloudinary.com/do-an-cnpm/image/upload/v1618073475/person_j0pvho.png',
                  }}
                />
              </View>
              <View style = {styles.content}>
                  <Text style={styles.textName}>
                    {_.get(this.props.user, 'fullName') || `Le Trung Nam`}
                  </Text>
                  <Text style={styles.textemail}>
                    Email:{' '}
                    {_.get(this.props.user, 'email') || `Trungnam23799@gmail.com`}
                  </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getProfile,
};

const mapStateToProps = (state) => {
  const {loading, user, status, msg} = state.getProfile;
  return {
    loading,
    user,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  scroll: {
    minHeight: windowHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    margin: 5,
   borderRadius: 10,
    padding: 10,
  },
  tinyLogo: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50,
  },
  textLabel: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
  },
  textName: {
    fontSize: 30,
    color: 'red',
    marginLeft: 20,
    marginTop: 5,
  },
  cv: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'column',
  },
  imgContainer: {
   
    display: 'flex',
    flexDirection: 'column',
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1
  },
  textemail: {
    fontSize: 20,
    marginLeft: 9,
    marginTop: 5,
  },
  content : {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#aecce2',
    padding: 10,
    borderRadius: 10
  },
  titleList: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30
  }
});
