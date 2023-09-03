import { useState } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';

import Text from '../components/Text';
import Input from '../components/Input';
import Continue from '../components/Continue';
import Button from '../components/Button';

export default function ImagePickerExample() {
    const [images, setImages]: [images: string[], setImages: any] = useState([]);
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0.0)

    const pickImages = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            orderedSelection: true,
            quality: 1,
        });

        if (result.canceled) return // else
        let uris: string[] = []
        result.assets.forEach(asset => {
            const assetUri = asset.uri
            if (!images.includes(assetUri)) uris.push(assetUri)
        });
        setImages([...uris]);
    };

    async function submitHandle() {
        // ----------- upload to db -------------
        if (!images) throw Error('Must include images')
        if (!price) throw Error('Must include price')

        // images
        let fileNames: string[] = []

        const formData = new FormData()
        for (const imageUri of images) {
            const filename = uuid.v4().toString() + imageUri.split('/').pop()
            const file = await FileSystem.getInfoAsync(imageUri);

            if (!file.exists) return
            const fileData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            formData.append('photos', {
                uri: imageUri,
                name: filename,
                data: fileData,
            } as any); //it works couldn't find solution
            fileNames.push(filename)
        }
        try {
            const res = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,

                headers: {
                    'Content-Type': 'multipart/form-data'
                },

            })
            console.log('🔥', await res.text())
            // setImages([])
        } catch (e) {
            console.error(e)
        }

        // data
        try {
            // trpc post details
        } catch (e) {
            console.error(e)
        }

    }
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'flex-start', width: '100%', gap: 15 }}>


            {/* images */}
            {/* give options to remove each image from the array. STRETCH -> change order */}
            {images && (
                <FlatList
                    style={{ backgroundColor: 'grey', maxHeight: 300, width: '100%', marginVertical: 15, paddingTop: 10 }}
                    data={images}
                    renderItem={(image) => (
                        <Image key={Math.random()} source={{ uri: image.item }} style={{ width: '28.3%', height: 100, objectFit: 'contain', marginHorizontal: '2.5%', marginTop: 5 }} />
                    )}
                    numColumns={3}
                    keyExtractor={(image) => image}
                    ListFooterComponent={(
                        <Button colour='orange' text='Pick an image from your camera roll' cb={pickImages} />
                    )}
                />
            )
            }

            {/* description */}
            < Input
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
                value={price.toString()}
                cb={(value) => setPrice(value)}
            />

            {/* submit */}
            <Continue cb={submitHandle} style={{ marginRight: 25, marginTop: 20, alignSelf: 'flex-end' }} />
        </SafeAreaView>
    );
}
