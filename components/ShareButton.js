// @flow
import React from 'react';
import {StyleSheet, Share, Image, Pressable} from 'react-native';
// import {APP_NAME} from '../libs/Consts';
type Props = {
  palette: Object,
};
export default class ShareButton extends React.PureComponent<Props, {}> {
  render() {
    return (
      <Pressable style={styles.shareButton} hitSlop={20} onPress={this.share}>
        <Image
          style={styles.shareIcon}
          source={require('../assets/images/shareIcon.png')}
        />
      </Pressable>
    );
  }

  share = async () => {
    try {
      const result = await Share.share({
        message: this.formatMessage(),
        url: '',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.warn(error.message);
    }
  };

  formatMessage = () => {
    let {palette} = this.props;
    return palette
      .map((item) => this.camelize(item.prettyName) + ': ' + item.color + '\n')
      .toString()
      .replace(/,/g, '');
  };

  camelize = (colorName: string) => {
    return colorName
      .replace("'", '')
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })

      .replace(/\s+/g, '');
  };

  formatColorName = (colorName: string) => {
    return colorName.replace(' ', '').replace(' ´', '').replace("'", '');
  };
}

const styles = StyleSheet.create({
  shareButton: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
  },
  shareIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center',
  },
});
