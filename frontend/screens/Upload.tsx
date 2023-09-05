import { useState, useEffect } from 'react';
import { FlatList, Image, SafeAreaView, ActivityIndicator, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { trpc } from '../utils/trpc';

import Input from '../components/Input';
import Continue from '../components/Continue';
import Button from '../components/Button';
import { useUser } from '@clerk/clerk-expo';

export default function Upload({ navigation }: any) {
    const { user } = useUser()
    const createListing = trpc.uploadListing.useMutation()

    const [images, setImages]: [images: string[], setImages: any] = useState([]);
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('0.0')
    const [isUploading, setIsUploading] = useState<null | boolean>(null)

    useEffect(() => {
        if (isUploading === false) navigation.navigate('Account')
    }, [isUploading])

    const pickImages = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            orderedSelection: true,
            quality: 1,
        });

        if (result.canceled) return // else
        const uris: string[] = []
        result.assets.forEach(asset => {
            const assetUri = asset.uri
            if (!images.includes(assetUri)) uris.push(assetUri)
        });
        setImages([...uris]);
    };

    async function handleSubmit() {
        setIsUploading(true)
        // ----------- upload to db -------------
        if (!images) throw Error('Must include images')
        if (!price) throw Error('Must include price')

        // images
        const fileNames: string[] = []

        for (const imageUri of images) {
            const fileName = imageUri.split('/').at(-1) as string

            try {
                const response = await FileSystem.uploadAsync(`http://localhost:3001/upload?name=${fileName}`, imageUri, {
                    fieldName: 'photos',
                    httpMethod: 'POST',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    mimeType: `image/${fileName.split('.').pop()}`
                });
                if (response.status !== 200) throw Error('failed upload')
                fileNames.push(fileName)
                // setImages([])
            } catch (e) {
                console.error(e)
            }
        }

        try {
            // trpc post details
            const email = user?.primaryEmailAddress?.emailAddress
            if (email) {
                createListing.mutate({ email, price: parseFloat(price), images: fileNames, description })
            }
            setIsUploading(false)
        } catch (e) {
            console.error(e)
        }
        setIsUploading(null)
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
                value={price}
                cb={(value) => setPrice(value)}
            />

            {/* submit */}
            <View style={{ marginRight: 30, marginTop: 20, alignSelf: 'flex-end' }}>
                {isUploading === true ?
                    <ActivityIndicator size="large" /> :
                    <Continue cb={handleSubmit} />
                }
            </View>
        </SafeAreaView>
    );
}
