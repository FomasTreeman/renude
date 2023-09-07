import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../../components/Input';

describe('Input component', () => {
    test('renders correctly', () => {
        const { getByTestId } = render(
            <Input placeholder="Enter text" cb={() => { }} />
        );
        const inputElement = getByTestId(`input`);
        expect(inputElement).toBeTruthy();
    });

    test('calls callback function on text change', () => {
        const mockCallback = jest.fn();
        const { getByTestId } = render(
            <Input placeholder="Enter text" cb={mockCallback} />
        );
        const inputElement = getByTestId(`input`);
        fireEvent.changeText(inputElement, 'Hello');
        expect(mockCallback).toHaveBeenCalledWith('Hello');
    });
});