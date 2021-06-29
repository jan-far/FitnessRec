import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';
import DateHeader from './DateHeader';
import { gray } from '../utils/color'

const MetricCard = ({ date, metrics }) => {
  return (
    <View>
      {date && <DateHeader date={date} />}
      {Object.keys(metrics).map((metric) => {
        const { getIcon, displayName, units, backgroundColor } = getMetricMetaInfo(metric);

        return (
          <View style={styles.metric} key={metric}>
            {getIcon()}
            <View>
              <Text style={{ fontSize: 20 }}>{displayName}</Text>
              <Text style={{ fontSize: 16, color: gray }}>
                {metrics[metric]} {units}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  metric: {
    flexDirection: 'row',
    marginTop: 12,
  },
});

export default MetricCard;
