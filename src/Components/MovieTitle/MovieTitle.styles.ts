import React from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: 'black',
  },
  container: {
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    margin: 5,
    padding: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  image: { width: 60, height: 60 },
  textContainer: {
    flexGrow: 1,
  },
});
