// libs
import * as React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// src
import CarouselItem from './CarouselItem';
import { CarouselItemData, DropAreaLayout } from './types';
import DraggableItem from './DraggableItem';

type Props = {
  isDraggable: boolean,
  item: CarouselItemData,
  data: any,
  dropAreaLayout: DropAreaLayout,
  renderItem?: (data: any) => JSX.Element,
  onItemPress: () => void,
  onItemDrop: () => void,
  onItemLayoutChange: (event: any) => void,
  setItemDraggingState: (isDragging: boolean) => void,
  setItemCollision: (isColliding: boolean) => void,
};

const CarouselItemWrapper = (props: Props) => {
  const {
    isDraggable,
    item,
    data,
    dropAreaLayout,
    renderItem,
    onItemPress,
    onItemDrop,
    onItemLayoutChange,
    setItemDraggingState,
    setItemCollision,
  } = props;
  const { h, opacity, w, X, Y, zIndex } = item;
  const wrapperStyle = {
    opacity,
    zIndex,
    marginTop: Y,
    marginLeft: X,
    width: w,
    height: h,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };
  let CarouselItemView = renderItem ? (
    renderItem(data, onItemLayoutChange)
  ) : (
    <CarouselItem data={data} />
  );
  CarouselItemView = isDraggable ? (
    <DraggableItem
      data={data}
      item={item}
      dropAreaLayout={dropAreaLayout}
      onPress={onItemPress}
      onDrop={onItemDrop}
      setDraggingState={setItemDraggingState}
      setItemCollision={setItemCollision}
    >
      {CarouselItemView}
    </DraggableItem>
  ) : (
    CarouselItemView
  );

  if (Platform.OS === 'ios') {
    return (
      <TouchableWithoutFeedback onPress={onItemPress}>
        <View style={wrapperStyle}>{CarouselItemView}</View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableNativeFeedback onPress={onItemPress}>
      <View style={wrapperStyle}>{CarouselItemView}</View>
    </TouchableNativeFeedback>
  );
};

export default CarouselItemWrapper;
