import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Text from './Text';

interface IBackProps {
    navigateTo: string;
}

const Back = ({ navigateTo }: IBackProps) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate(navigateTo as never);
    };

    return (
        <Pressable onPress={handlePress}>
            <Text tag='h2' style={{ padding: 10 }}>⇦</Text>
        </Pressable>
    );
};

export default Back;
