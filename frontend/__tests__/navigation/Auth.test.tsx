// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import '@testing-library/jest-native/extend-expect';
// import AuthNavigator from '../../components/AuthNavigator';
// // import SignUp from '../../screens/SignUp';

// describe('AuthNavigator Component', () => {
//     it('renders the SignUp screen when SignUp navigator element is pressed', () => {
//         const { getByText, getByTestId } = render(<AuthNavigator />);
//         const signUpNavigatorElement = getByText('SignUp');

//         fireEvent.press(signUpNavigatorElement);

//         const signUpScreen = getByTestId('SignUpScreen');
//         expect(signUpScreen).toBeTruthy();
//         expect(signUpScreen).toHaveTextContent(getByText('Sign Up'));

//         // You can also assert that other elements specific to the SignUp screen are rendered correctly
//         // For example:
//         // expect(signUpScreen).toContainElement(getByTestId('SignUpForm'));
//     });

//     // Add similar tests for other navigator elements and screens
// });