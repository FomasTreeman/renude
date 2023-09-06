import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import toHave
import Button from '../components/Button';

describe('Button Component', () => {
    it('renders the correct text', () => {
        const { getByText } = render(<Button colour="green" text="Test Button" cb={() => { }} />);
        const buttonText = getByText('Test Button');
        expect(buttonText).toBeTruthy();
    });
    it('calls the callback function when pressed', () => {
        const mockCallback = jest.fn();
        const { getByText } = render(<Button colour="green" text="Test Button" cb={mockCallback} />);
        const button = getByText('Test Button');
        fireEvent.press(button);
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('renders with the correct background color', () => {
        const { getByTestId } = render(<Button colour="purple" text="Test Button" cb={() => { }} />);
        const button = getByTestId('button');
        expect(button).toHaveProperty({ style: { 'backgroundColor': 'purple' } });
    });
});