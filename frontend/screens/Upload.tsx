import { useState } from 'react';
import { Button, Image, Pressable, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Text from '../components/Text';
import Input from '../components/Input';

export default function ImagePickerExample() {
    const [images, setImages]: [images: string[], setImages: any] = useState([]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            orderedSelection: true,
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            const assetUri = result.assets[0].uri;
            if (images.includes(assetUri)) return;
            setImages([...images, assetUri]);
            // make request to express to upload to S3

        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* images */}
            <Pressable onPress={pickImage} className='bg-red-600 h-40'>
                <Text tag='h3'> Pick an image from camera roll </Text>
            </Pressable>
            {/* give options to remove each image from the array. STRETCH -> change order */}
            {images && images.map((image) => <Image key={Math.random()} source={{ uri: image }} style={{ width: 200, height: 200 }} />)}
            {/* description */}
        
            {/* price */}
        </SafeAreaView>
    );
}
