import React from 'react';
import {TouchableOpacity} from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import {IProduct} from '../constants/types';
import {useTheme} from '../hooks';

const Product = ({image, title, type, linkLabel}: IProduct) => {
    const {assets, colors, sizes} = useTheme();

    const isHorizontal = type !== 'vertical';
    const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

    return (
        <Block
            card
            flex={0}
            row={false}
            marginBottom={sizes.sm}
            marginRight={sizes.sm}
            width={CARD_WIDTH}>
            <Image
                resizeMode="cover"
                source={{uri: image}}
                style={{
                    height:  162,
                    width: '100%' ,
                }}
            />
            <Block
                padding={sizes.s}
                justify="space-between"
                flex={ 0}>
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
