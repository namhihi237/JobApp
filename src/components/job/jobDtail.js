import React, {Component} from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export class JobDetail extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
  }
  render() {
    const {item} = this.props;
    return (
      <View style={styles.itemDetail}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>{item?.title}</Text>
          <Text style={styles.text}>{item?.company[0].name}</Text>
          <Text style={styles.text}>Address: {item?.address}</Text>
          <Text style={styles.text}>Skill: {item?.skill.join(', ')}</Text>
          <Text style={styles.text}>Salary: {item?.salary}</Text>
          <Text style={styles.text}>End time: {item?.endTime}</Text>
          <Text style={styles.text}>
            Description:{'\n'}
            {item?.description}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemDetail: {
    minHeight: (windowHeight - 10) / 4,
    width: (windowWidth * 2.3) / 3,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#d9d2c5',
    shadowOpacity: 0.6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'TimesNewRoman',
  },
});
