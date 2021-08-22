import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _ from 'lodash';
const windowWidth = Dimensions.get('window').width;
const Search = (props) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInput}>
        <TextInput
          style={{
            height: 50,
            width: wp('75%'),
            fontFamily: 'TimesNewRoman',
            fontSize: 16,
          }}
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder}
          placeholderTextColor="#a5a5a5"></TextInput>
        <TouchableOpacity style={styles.searchButton} onPress={props.onPress}>
          <FontAwesome5
            name={'search'}
            style={{fontSize: 22, marginTop: 2, color: '#f25430'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
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
    width: windowWidth - 40,
    borderColor: '#E0E0E0',
    margin: wp('4%'),
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    paddingLeft: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  searchButton: {
    height: 40,
    paddingRight: 30,
    width: windowWidth * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Search;
