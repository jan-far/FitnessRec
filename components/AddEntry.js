import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import {
  getDailyReminderValue,
  getMetricMetaInfo,
  timeToString,
  clearLocalNotification,
  setLocalNotification,
} from '../utils/helpers';
import DateHeader from './DateHeader';
import Slider from './Slider';
import Stepper from './Stepper';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { removeEntry, submitEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { purple, white } from '../utils/color';
import { NavigationActions } from 'react-navigation';

const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.adnroidSubmit}
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
};

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  };

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);
    this.setState((state) => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count,
      };
    });
  };

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const count = state[metric] - step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };

  slider = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }));
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // add entry to redux
    this.props.dispatch(
      addEntry({
        [key]: entry,
      })
    );

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    });

    // save to localStorage as DB
    submitEntry({ key, entry });

    // Navigate back home
    this.toHome();

    // clear local notification for the day and set notification for the next day on submit
    clearLocalNotification().then(() => setLocalNotification());
  };

  reset = () => {
    const key = timeToString();

    // remove entry from redux amd update
    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    // remove from LocalStorage
    removeEntry(key);

    // Navigate back home
    this.toHome();
  };

  toHome = () => {
    this.props.navigation.navigate('History');
  };

  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'} size={100} />
          <Text>You already logged your information today</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider' ? (
                <Slider value={value} onChange={(value) => this.slider(key, value)} {...rest} />
              ) : (
                <Stepper
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    margin: 40,
  },
  adnroidSubmit: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginLeft: 30,
  },
});

const mapStateToProps = (state) => {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',
  };
};

export default connect(mapStateToProps)(AddEntry);
