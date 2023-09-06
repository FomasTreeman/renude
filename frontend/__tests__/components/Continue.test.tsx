import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Continue from '../../components/Continue';

describe('Continue Component', () => {
    it('calls the callback function when pressed', () => {
        const mockCallback = jest.fn();
        const { getByText } = render(<Continue cb={mockCallback} />);
        const button = getByText('Test Button');
        fireEvent.press(button);
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
    // isError arg
});