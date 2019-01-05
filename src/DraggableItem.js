// libs
import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
} from 'react-native';

// src
import { CarousalItemData, DropAreaLayout } from './types';
import { isCollidingWithDropArea } from './utils';

type Props = {
  item: CarousalItemData,
  dropAreaLayout: DropAreaLayout,
  onDrop: () => void,
  onPress: () => void,
  setDraggingState: (isDragging: boolean) => void,
};

type State = {
  pan: any,
};

export default class DraggableItem extends React.Component<Props, State> {
  panResponder: PanResponderInstance = null;
  _val = null;
  state = { pan: new Animated.ValueXY() };

  UNSAFE_componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 };
    const { pan } = this.state;

    pan.addListener(value => (this._val = value));
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        e: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const { setDraggingState } = this.props;
        const { moveY, y0 } = gesture;

        if (moveY - y0 > 20) {
          setDraggingState(true);

          return Animated.event([null, { dx: pan.x, dy: pan.y }])(e, gesture);
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const {
          item,
          dropAreaLayout,
          onPress,
          onDrop,
          setDraggingState,
        } = this.props;
        const { moveX, moveY, x0, y0 } = gesture;

        if (onPress && (moveX === x0 && moveY === y0)) {
          onPress();
        } else if (isCollidingWithDropArea(dropAreaLayout, gesture, item)) {
          onDrop();
        }
        setDraggingState(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
        }).start();
      },
    });
    // adjusting delta value
    pan.setValue({ x: 0, y: 0 });
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    const { children } = this.props;
    const panHandlers = this.panResponder.panHandlers;

    return (
      <Animated.View {...panHandlers} style={[panStyle]}>
        {children}
      </Animated.View>
    );
  }
}