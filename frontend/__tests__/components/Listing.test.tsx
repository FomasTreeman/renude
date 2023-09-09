import React from "react";
import { render, RenderAPI } from "@testing-library/react-native";
import Listing from "../../components/Listing";

describe("Listing component", () => {
    let listingComponent: RenderAPI;

    const mockListingProps = {
        price: 100,
        description: "Test description",
        image: [{ path: "3DADD641-2042-41A2-98DB-B7BE4C8C7F83.jpg" }],
    };

    beforeEach(() => {
        listingComponent = render(<Listing listing={mockListingProps} />);
    });

    it("displays the correct price", () => {
        const { getByText } = listingComponent;
        const priceElement = getByText("£100");
        expect(priceElement).toBeTruthy();
    });

    it("displays the description when provided", () => {
        const { getByText } = listingComponent;
        const descriptionElement = getByText("Test description");
        expect(descriptionElement).toBeTruthy();
    });

    it("does not display the description when not provided", () => {
        const { queryByText } = listingComponent
        const descriptionElement = queryByText("Test description");
        expect(descriptionElement).toBeNull();
    });

    it("displays the image", () => {
        const { getByTestId } = listingComponent;
        const imageElement = getByTestId("listing-image");
        expect(imageElement).toBeTruthy();
    });
});