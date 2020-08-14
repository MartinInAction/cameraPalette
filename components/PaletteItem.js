/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import hexToRgba from 'hex-to-rgba';

export default class PaletteItem extends React.PureComponent<{}> {
  state = {
    showHex: true,
  };

  render = () => {
    let {paletteItem} = this.props;
    return (
      <Pressable
        style={[styles.paletteItem, {backgroundColor: paletteItem.color}]}
        onPress={this.toggleColorFormat}>
        <View style={styles.colorTextContainer}>
          <Text style={styles.colorName}>{paletteItem.name}</Text>
          <Text style={styles.colorText}>
            {this.state.showHex
              ? paletteItem.color
              : hexToRgba(paletteItem.color)}
          </Text>
        </View>
      </Pressable>
    );
  };

  toggleColorFormat = () => this.setState({showHex: !this.state.showHex});
}

const styles = StyleSheet.create({
  paletteItem: {
    margin: 10,
    marginLeft: 20,
    height: 80,
    width: 100,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'flex-end',
  },
  colorTextContainer: {
    width: 120,
    left: -10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  colorText: {
    color: '#fff',
    fontSize: 10,
  },
  colorName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
});
