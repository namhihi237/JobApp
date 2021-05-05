import React, {Component} from 'react';
import {Loader} from '../../common';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {} from '../../redux/actions';
import {Toast} from 'native-base';
import {getData} from '../../utils';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class ApplyList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['STT', 'Full Name', 'Email', 'CV'],
      widthArr: [50, 150, 220, 80],
      tableData: [],
    };
  }

  showToast = (msg, type) => {
    Toast.show({
      text: `${msg}`,
      buttonText: 'Okey',
      duration: 3000,
      type,
    });
  };

  componentDidMount() {
    this._isMounted = true;
    const postId = this.props.route.params.postId;

    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      try {
        const token = await getData('token');
        const result = await axios.get(
          `https://job-it-cnpmp.herokuapp.com/api/v1/posts/${postId}/apply-list`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        const applies = result.data.applies;
        let count = 1;
        let tableData = [];
        for (let iter of applies) {
          let rowData = [];
          rowData.push(count);
          rowData.push(iter.name);
          rowData.push(iter.email);
          rowData.push(iter.cvId);
          tableData.push(rowData);
          count++;
        }
        this.setState({tableData});
      } catch (error) {
        console.log(error);
      }
    });
    return unsubscribe;
  }

  moveToCreatePost = () => {
    this.props.navigation.navigate('CreatePost');
  };

  componentWillUnmount() {
    this._isMounted = false;
  }
  _moveToCv(cvId) {
    this.props.navigation.navigate('CV', {cvId});
  }
  render() {
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._moveToCv(data)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>show Cv</Text>
        </View>
      </TouchableOpacity>
    );
    // if (this.props.status != 200 && this.props.status != 304) {
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#473030'}}>
                <Row
                  data={this.state.tableHead}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={this.state.widthArr}
                />
                {this.state.tableData.map((rowData, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={
                          cellIndex === 3 ? element(cellData, index) : cellData
                        }
                        style={{width: this.state.widthArr[cellIndex]}}
                        textStyle={styles.text}
                      />
                    ))}
                  </TableWrapper>
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
  // return <View style={styles.container}></View>;
  // }
}
const mapDispatchToProps = {};

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ApplyList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#808B97',
  },
  text: {
    margin: 6,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF1C1',
  },
  btn: {
    width: 58,
    height: 20,
    backgroundColor: '#78B7BB',
    borderRadius: 2,
    marginLeft: 5,
    padding: 2,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
  },
});
