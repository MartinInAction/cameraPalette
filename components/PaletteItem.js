/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {getColorName} from '../Consts/ColorNames';

import React from 'react';
import {
  Platform,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  View,
  Text,
} from 'react-native';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class PaletteItem extends React.PureComponent<{}> {
  state = {
    showHex: true,
  };

  componentDidMount = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  render = () => {
    let {paletteItem} = this.props;
    return (
      <>
        <View
          style={[
            styles.paletteItem,
            {
              ...this.getBorderRadius(),
              height: this.getHeight(),
              backgroundColor: paletteItem.color,
            },
          ]}
        />
        {/* <Text style={styles.colorName}>{getColorName(paletteItem.color)}</Text>*/}
      </>
    );
  };

  getBorderRadius = () => {
    let {palette, index} = this.props;
    if (index === 0) {
      return {borderTopLeftRadius: 50, borderTopRightRadius: 50};
    }
    if (palette.length - 1 === index) {
      return {borderBottomLeftRadius: 50, borderBottomRightRadius: 50};
    }
  };

  getHeight = () => {
    let {paletteItem} = this.props;
    let val = 600 * paletteItem.percentage;
    return val > 40 ? val : 40;
  };

  toggleColorFormat = () => this.setState({showHex: !this.state.showHex});
}

const styles = StyleSheet.create({
  paletteItem: {
    marginLeft: 20,
    height: 50,
    width: 50,
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
    alignSelf: 'flex-end',
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
});
