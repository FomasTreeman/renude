const palette = {
    text: '#000000',
    bg: '#FCFCFC',
    primary: {
        purple: '#BFBCF3',
        green: '#B1FEC9',
        yellow: '#F4E285',
        orange: '#F4A259',
    },
    secondary: {
        purple: '#B2AEF6',
        green: '#8AFEAE',
        yellow: '#F5DE66',
        orange: '#F5953F',
    }
}

export const theme = {
    colours: {
        background: palette.bg,
        text: palette.text,
        primary: palette.primary,
        secondary: palette.secondary
    },
    spacing: {
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
    },
    textVariants: {
        h1: {
            fontFamily: 'Syne',
            fontSize: 38,
            fontWeight: 'bold',
        },
        h2: {
            fontFamily: 'Syne',
            fontSize: 32,
            fontWeight: 'normal',
        },
        h3: {
            fontFamily: 'Syne',
            fontSize: 24,
            fontWeight: '400',
        },
        h4: {
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: '500',
        },
        body: {
            fontFamily: 'Inter',
            fontSize: 14,
        },
        error: {
            fontFamily: 'Inter',
            fontSize: 12,
            color: 'red'
        },
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    shadowLg: {
        shadowColor: 'black',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    border: {
        borderBlockColor: 'black',
        borderWidth: 2
    }
};


// export const darkTheme = {
//     ...theme,
//     colors: {
//         ...theme.colors,
//         background: palette.black,
//         foreground: palette.white,
// }