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
import {getCv} from '../../redux/actions/getCv';
import {getData} from '../../utils'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class getOneCv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCv : []
    };
  }

  showToast = (msg) => {
    ToastAndroid.show(`${msg}`, ToastAndroid.SHORT);
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

       

  keyExtractor = (item) => {
    return item._id;
  };

  componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.props.getCv();
      this.showToast(this.props.msg);
      //console.log(this.props)
      this.setState({
        dataCv: this.props.cv
      });
      //console.log(this.state);
    });

    return unsubscribe;
  }

  moveToCreateCv = () => {
    this.props.navigation.navigate('CreateCv');
  };

  render() {
    const {dataCv} = this.state;
    //console.log(dataCv)
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
          <Text style={styles.titleList}>{dataCv.iterName}</Text>
          <View style = {styles.cv}>
            <Text style={styles.text}>Personal Skill: {dataCv.personalSkill}</Text>
            <Text style={styles.text}>Skill: {dataCv.skill}</Text>
            <Text style={styles.text}>Experience: {dataCv.experience}</Text>
            <Text style={styles.text}>Description: {dataCv.description}</Text>
          </View>
        </View>
        <View style={styles.line} />
       
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={this.moveToCreateCv}>
          <Text style={styles.textAdd}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapDispatchToProps = {
  getCv,
};

const mapStateToProps = (state) => {
  //console.log(state.getCv)
  const {loading, cv, status, msg} = state.getCv;

  return {
    loading,
    cv,
    status,
    msg,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(getOneCv);

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
  text : {
    fontSize: 20,
    
  },
  cv: {
    marginTop : 20,
    marginLeft: 20

  }

});
