/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import {App} from './src/App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs(); //Ignore all log notifications
AppRegistry.registerComponent(appName, () => App);
