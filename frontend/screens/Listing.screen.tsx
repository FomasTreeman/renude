import { SafeAreaView } from "react-native";
import ListingComponent from "../components/Listing";
import Back from "../components/Back";

interface IListingProps {
    route: {
        params: {
            listing?: any, //find type
            previousScreen?: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any,
    },
    [key: string]: any,

}


export default function Listing({ route: { params } }: IListingProps) {
    return (
        <SafeAreaView>
            <Back navigateTo={params?.previousScreen || ''} />
            <ListingComponent listing={params?.listing} />
        </SafeAreaView>
    )
}