import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addEntry, receiveEntries } from '../actions';
import { fetchCalendarResult } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import Agenda from 'udacifitness-calendar';
import DateHeader from './DateHeader';
import { white } from '../utils/color';
import MetricCard from './MetricCard';
import AppLoading from 'expo-app-loading';

class History extends Component {
  state = {
    ready: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    fetchCalendarResult()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then((entries) => {
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            })
          );
        }
      })
      .then(() =>
        this.setState(() => ({
          ready: true,
        }))
      );
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => {
    return (
      <View style={styles.item}>
        {today ? (
          <View>
            <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>{today}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('EntryDetail', { entryId: key })}
          >
            <MetricCard date={formattedDate} metrics={metrics} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderEmptyDate = (formattedDate) => {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>You didn't log any data on this day.</Text>
      </View>
    );
  };

  render() {
    const { entries } = this.props;
    const { ready } = this.state;

    if (ready === false) {
      return <AppLoading  autoHideSplash={true} />;
    }

    return (
      <Agenda items={entries} renderItem={this.renderItem} renderEmptyDate={this.renderEmptyDate} />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 8,
    padding: 20,
    marginTop: 17,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0,0,0,0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

const mapStateToProps = (entries) => {
  return {
    entries,
  };
};

export default connect(mapStateToProps)(History);
