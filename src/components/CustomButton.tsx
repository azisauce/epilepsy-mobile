import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
    textColor?: string;  // Allow custom text color
}

export default function CustomButton({
    title,
    onPress,
    variant = 'primary',
    style,
    textColor
}: CustomButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'secondary' && styles.secondaryButton,
                style
            ]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, textColor && { color: textColor }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    secondaryButton: {
        // Add any secondary-specific styles here if needed
    },
    buttonText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
});
