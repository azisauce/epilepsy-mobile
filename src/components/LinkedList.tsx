import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export interface LinkedUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'parent' | 'child';
}

interface LinkedListProps {
    users: LinkedUser[];
    userRole: 'parent' | 'child';
    onUserPress?: (user: LinkedUser) => void;
    loading?: boolean;
}

export default function LinkedList({ users, userRole, onUserPress, loading }: LinkedListProps) {
    const listTitle = userRole === 'parent' ? 'My Children' : 'My Parents';
    const emptyMessage = userRole === 'parent'
        ? 'No children linked yet.\nGenerate an invite link to connect with your child.'
        : 'No parents linked yet.\nAsk your parent to send you an invite link.';

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{listTitle}</Text>
                <Text style={styles.emptyText}>Loading...</Text>
            </View>
        );
    }

    if (users.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{listTitle}</Text>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>👥</Text>
                    <Text style={styles.emptyText}>{emptyMessage}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{listTitle}</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.userCard}
                        onPress={() => onUserPress?.(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                                {item.firstName} {item.lastName}
                            </Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                        </View>
                        <Text style={styles.roleTag}>
                            {item.role === 'parent' ? '👨‍👩‍👦 Parent' : '👶 Child'}
                        </Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

import { COLORS } from '../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 24,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.gray,
    },
    roleTag: {
        fontSize: 12,
        color: COLORS.secondary,
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    separator: {
        height: 12,
    },
});
