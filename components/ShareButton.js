import React from 'react';
import {StyleSheet, Share, Image, Pressable} from 'react-native';

export default class ShareButton extends React.PureComponent<{}, {}> {
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

  share = async (url) => {
    try {
      const result = await Share.share({
        message: 'Camera Palette 🎨',
        url: this.props.shareImage,
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
}

const styles = StyleSheet.create({
  shareButton: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 60,
  },
  shareIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center',
  },
});
