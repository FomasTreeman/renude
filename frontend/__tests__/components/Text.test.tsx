import React from "react";
import { render } from "@testing-library/react-native";
import Text from "../../components/Text";

test("renders text with default style", () => {
    const { getByText } = render(<Text tag="h1">Hello World</Text>);
    const textElement = getByText("Hello World");

    expect(textElement).toBeTruthy();

    // const computedStyles = window.getComputedStyle(textElement);
    // expect(computedStyles.color).toBe("black");
});