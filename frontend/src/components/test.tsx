import React from 'react';
import {TouchableOpacity} from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import {IProduct} from '../constants/types';
import {useTheme} from '../hooks';

const Product = ({image, title, type, linkLabel}: IProduct) => {
    const {assets, colors, sizes} = useTheme();

    const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

    return (
        <Block
            card
            flex={0}
            row={true}
            marginBottom={sizes.sm}
            width={CARD_WIDTH * 2 + sizes.sm}>
            <Image
                resizeMode="cover"
                source={{uri: image}}
                style={{
                    height:114,
                    width:'30%',
                }}
            />
            <Block
                padding={sizes.s}
                justify="space-between"
                flex={1}>
                <Text p semibold marginBottom={sizes.s}>
                    {title}
                </Text>
                <TouchableOpacity>
                    <Text p primary semibold>
                        {linkLabel || 'Read Article'}
                    </Text>
                </TouchableOpacity>
            </Block>
        </Block>
    );
};

export default Product;
