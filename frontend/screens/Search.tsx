import { FlatList, View, SafeAreaView, StyleSheet, TextInput } from "react-native";
import { trpc } from '../utils/trpc';

import Input from "../components/Input";
import Continue from "../components/Continue";
import Button from "../components/Button";
import Text from "../components/Text";
import Listing from "../components/Listing";

export default function Search() {
    const listingsQuery = trpc.allListings.useQuery()

    return (
        <SafeAreaView className="mx-1">
            <View style={{ ...styles.list, justifyContent: 'space-between', margin: 15 }}>
                <TextInput placeholder="Search ..." style={{ ...styles.textInput, width: 250 }} />
                <Continue cb={(() => { })} />
            </View>
            <View style={styles.list}>
                <Button colour="orange" text='jeans' cb={() => { }} />
                <Button colour="purple" text='shoes' cb={() => { }} />
            </View>
            <FlatList
                style={{ marginTop: 20 }}
                data={listingsQuery.data}
                renderItem={({ item }) => <Listing {...item} height={100} width={150} footerSize='lg' />}
                keyExtractor={item => `ListEntry-${item.createdAt}`}
                numColumns={2}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    list: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        fontFamily: 'Inter',
        backgroundColor: 'white',
        borderWidth: 2,
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0.2,
        padding: 10,
        borderRadius: 50,
    }
})