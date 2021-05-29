import { Asset } from 'expo-media-library';
import React, {useEffect, useRef, useState, createRef} from 'react';
import { View, useWindowDimensions, StyleSheet, Image, Text } from 'react-native';
import {story, } from '../types/interfaces';
import { useBackHandler } from '@react-native-community/hooks'

import {
  TapGestureHandler,
  HandlerStateChangeEvent,
  TapGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';

interface Props {
  story:story;
  duration: number;
  numColumns: 2|3|4;
  text?: string | undefined;
  height: number;
  setShowStory: Function;
  showStory:boolean;
  setStory:Function;
}

const Highlights: React.FC<Props> = (props) => {
  const isMounted = useRef(false);
  useEffect(() => {
      isMounted.current = true;
      return () => {isMounted.current = false;}
  }, []);

  const SCREEN_WIDTH = useWindowDimensions().width;

  const _tapRef = createRef<TapGestureHandler>();

  useBackHandler(() => {
      if (props.showStory) {
        props.setShowStory(false);
        return true;
      }
      // let the default thing happen
      return false;
  });

  const openHighlight = () => {
    props.setStory(props.story);
    props.setShowStory(true);
    console.log('here');
  }

  const _onTapHandlerStateChange = ( event:HandlerStateChangeEvent<TapGestureHandlerEventPayload> ) => {
    if (event.nativeEvent.state === State.END){
      if(props.story && props.story.medias){
        openHighlight();
      }
    }
  }

  return props.story ? (
    <TapGestureHandler
      maxDist={3}
      numberOfTaps={1}
      ref={_tapRef}
      onHandlerStateChange={_onTapHandlerStateChange}
    >
      <View 
        style= {[
          styles.container, 
          {
            width: props.height/1.618,
            height: props.height
          }
        ]}
      >
        <Image
          style= {[
            styles.media, 
            {
              width: SCREEN_WIDTH/3,
              height: 1.618*SCREEN_WIDTH/3
            }
          ]}
          source={
            {uri: props.story?.medias[0]?.uri}
          }
        />
      </View>
    </TapGestureHandler>
  ) : (
    <Text></Text>
  );
};

const styles = StyleSheet.create({
  media: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10
  },
  storyHolder: {

  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex:5,
  },
});

export default Highlights;