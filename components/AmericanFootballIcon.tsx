
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse, Path, Line } from 'react-native-svg';

interface AmericanFootballIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export default function AmericanFootballIcon({ 
  size = 100, 
  color = '#FFFFFF',
  backgroundColor = '#8B4513'
}: AmericanFootballIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Football shape */}
        <Ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="25"
          fill={backgroundColor}
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Laces - center line */}
        <Line
          x1="50"
          y1="30"
          x2="50"
          y2="70"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Laces - horizontal lines */}
        <Line x1="45" y1="35" x2="55" y2="35" stroke={color} strokeWidth="2" />
        <Line x1="45" y1="42" x2="55" y2="42" stroke={color} strokeWidth="2" />
        <Line x1="45" y1="50" x2="55" y2="50" stroke={color} strokeWidth="2" />
        <Line x1="45" y1="58" x2="55" y2="58" stroke={color} strokeWidth="2" />
        <Line x1="45" y1="65" x2="55" y2="65" stroke={color} strokeWidth="2" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
