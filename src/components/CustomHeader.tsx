import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface CustomHeaderProps {
    variant?: 'welcome' | 'profile' | 'page';
    title?: string;
    subtitle?: string;
    userName?: string;
    userRole?: 'parent' | 'child';
}

export default function CustomHeader({
    variant = 'page',
    title,
    subtitle,
    userName,
    userRole,
}: CustomHeaderProps) {
    // Welcome variant (for HomeScreen)
    if (variant === 'welcome') {
        return (
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Welcome back, <Text style={styles.welcomeName}>{userName}!</Text>
                </Text>
                <Text style={styles.roleTag}>
                    {userRole === 'parent' ? '👨‍👩‍👦 Parent Account' : '👶 Child Account'}
                </Text>
            </View>
        );
    }

    // Profile variant (for ProfileScreen)
    if (variant === 'profile') {
        return (
            <View style={styles.container}>
                <Text style={styles.centeredTitle}>{title || 'Profile'}</Text>
            </View>
        );
    }

    // Page variant (for ThemesScreen and others)
    return (
        <View style={styles.container}>
            <Text style={styles.centeredTitle}>{title}</Text>
            {subtitle && <Text style={styles.centeredSubtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        padding: 24,
        paddingTop: 40,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    // Welcome variant styles
    welcomeText: {
        fontSize: 24,
        color: COLORS.secondary,
        marginBottom: 8,
    },
    welcomeName: {
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    roleTag: {
        fontSize: 14,
        color: COLORS.secondary,
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    // Centered title styles (for profile and page variants)
    centeredTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.secondary,
        textAlign: 'center',
    },
    centeredSubtitle: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: 8,
    },
});
