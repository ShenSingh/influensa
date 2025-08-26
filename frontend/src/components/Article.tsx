import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme} from '../hooks';
import {IArticle} from '../constants/types';

const Article = ({
  title,
  description,
  image,
  category,
  rating,
  location,
  timestamp,
  user,
  onPress,
}: IArticle) => {
  const {colors, gradients, icons, sizes} = useTheme();

  // render card for Newest & Fashion
  if (category?.id !== 1) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Block card padding={sizes.sm} marginTop={sizes.sm}>
          <Image height={170} resizeMode="cover" source={{uri: image}} />
          {/* article category */}
          <Text
            h5
            bold
            size={13}
            marginTop={sizes.s}
            transform="uppercase"
            marginLeft={sizes.xs}
            gradient={gradients.primary}>
            {category?.name}
          </Text>

          {/* article description */}
          <Text
            p
            marginTop={sizes.s}
            marginLeft={sizes.xs}
            marginBottom={sizes.sm}>
            {description}
          </Text>

          {/* article author details */}
          <Block row marginLeft={sizes.xs} marginBottom={sizes.xs}>
            <Image
              radius={sizes.s}
              width={sizes.xl}
              height={sizes.xl}
              source={{uri: user?.avatar}}
              style={{backgroundColor: colors.white}}
            />
            <Block justify="center" marginLeft={sizes.s}>
              <Text p semibold>
                {user?.name}
              </Text>
              <Text p gray>
                Posted on {dayjs(timestamp).format('DD MMMM') || '-'}
              </Text>
            </Block>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    );
  }

  // render card for Popular
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Block card white padding={0} marginTop={sizes.sm}>
        <Image
          background
          resizeMode="cover"
          radius={sizes.cardRadius}
          source={{uri: image}}>
          <Block color={colors.overlay} padding={sizes.padding}>
            <Text h4 white marginBottom={sizes.sm}>
              {title}
            </Text>
            <Text p white>
              {description}
            </Text>
            {/* user details */}
            <Block row marginTop={sizes.xxl}>
              <Image
                radius={sizes.s}
                width={sizes.xl}
                height={sizes.xl}
                source={{uri: user?.avatar}}
                style={{backgroundColor: colors.white}}
              />
              <Block justify="center" marginLeft={sizes.s}>
                <Text p white semibold>
                  {user?.name}
                </Text>
                <Text p white>
                  {user?.department}
                </Text>
              </Block>
            </Block>
          </Block>
        </Image>
      </Block>
    </TouchableWithoutFeedback>
  );
};

export default Article;
