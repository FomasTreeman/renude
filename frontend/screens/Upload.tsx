import { useState } from 'react';
import { Button, Image, Pressable, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Text from '../components/Text';
import Input from '../components/Input';
import Continue from '../components/Continue';

export default function ImagePickerExample() {
    const [images, setImages]: [images: string[], setImages: any] = useState([]);
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0.0)

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            orderedSelection: true,
            quality: 1,
        });

        // console.log(result);
        if (!result.canceled) {
            const assetUri = result.assets[0].uri;
            if (images.includes(assetUri)) return;
            setImages([...images, assetUri]);
            // make request to express to upload to S3

        }
    };

    async function submitHandle() {
        // upload to db
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'flex-start', width: '100%', gap: 15 }}>

            {/* images */}
            <Pressable onPress={pickImage} className='bg-slate-200 h-40 justify-center w-full'>
                <Text tag='body' className='items-center' > Pick an image from camera roll </Text>
            </Pressable>
            {/* give options to remove each image from the array. STRETCH -> change order */}
            {images && images.map((image) => <Image key={Math.random()} source={{ uri: image }} style={{ width: 200, height: 200 }} />)}

            {/* description */}
            <Input
                containerStyle={{ marginLeft: 25 }}
                style={{ width: 200 }}
                placeholder='Description'
                value={description}
                cb={(value) => setDescription(value)}
            />

            {/* price */}
            <Input
                containerStyle={{ marginLeft: 25 }}
                style={{ width: 100 }}
                placeholder='Price'
                inputMode='decimal'
                keyboardType='number-pad'
                maxLength={10}
                value={price}
                cb={(value) => setPrice(value)}
            />

            {/* submit */}
            <Continue cb={submitHandle} style={{ marginRight: 25, marginTop: 20, alignSelf: 'flex-end' }} />
        </SafeAreaView>
    );
}
