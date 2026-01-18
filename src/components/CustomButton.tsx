import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
    textColor?: string;  // Allow custom text color
}

import { COLORS } from '../constants/colors';

// ... interface ...

export default function CustomButton({
    title,
    onPress,
    variant = 'primary',
    style,
    textColor
}: CustomButtonProps) {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary ? styles.primaryButton : styles.secondaryButton,
                style
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.buttonText,
                isPrimary ? styles.primaryText : styles.secondaryText,
                textColor && { color: textColor }
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },
    primaryButton: {
        backgroundColor: COLORS.secondary,
        borderWidth: 0,
        elevation: 3,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.secondary,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: COLORS.white,
    },
    secondaryText: {
        color: COLORS.secondary,
    },
});
