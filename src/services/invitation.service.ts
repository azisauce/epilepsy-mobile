import { firestore } from '../config/firebase.config';
import {
    Invitation,
    InvitationStatus,
    CreateInvitationData,
    AcceptInvitationData
} from '../types/invitation.types';
import { UserRole } from '../types/user.types';

const INVITATIONS_COLLECTION = firestore().collection('invitations');
const USERS_COLLECTION = firestore().collection('users');

// Default expiration time for invitations (7 days)
const DEFAULT_EXPIRATION_DAYS = 7;

/**
 * Generate a unique invite link for a user
 * @param data - Data needed to create the invitation
 * @returns The created invitation document and the deep link
 */
export const generateInviteLink = async (data: CreateInvitationData) => {
    const { inviterId, inviterRole, inviterName, inviteeEmail, expirationDays = DEFAULT_EXPIRATION_DAYS } = data;

    console.log('[INVITE] Generating invite link', { inviterId, inviterRole });

    // Create invitation document
    const invitationRef = INVITATIONS_COLLECTION.doc();
    const invitationId = invitationRef.id;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000);

    // Firestore doesn't support undefined values, use null instead
    const invitation: Invitation = {
        id: invitationId,
        inviterRole,
        inviterId,
        inviterName,
        inviteeEmail: inviteeEmail || undefined, // Keep as undefined in type but won't write to Firestore
        status: 'pending',
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
    };

    // Remove undefined fields before writing to Firestore
    const firestoreData: any = {
        id: invitationId,
        inviterRole,
        inviterId,
        inviterName,
        status: 'pending',
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
    };

    // Only add inviteeEmail if it exists
    if (inviteeEmail) {
        firestoreData.inviteeEmail = inviteeEmail;
    }

    await invitationRef.set(firestoreData);
    console.log('[INVITE] Invitation created successfully', { invitationId });

    // Generate deep link
    const deepLink = `epilepsy-app://invite/${invitationId}`;

    return {
        invitation,
        deepLink,
    };
};

/**
 * Get invitation by ID
 * @param invitationId - The invitation ID
 * @returns The invitation document or null if not found/expired
 */
export const getInvitationById = async (invitationId: string): Promise<Invitation | null> => {
    console.log('[INVITE] Fetching invitation', { invitationId });

    const doc = await INVITATIONS_COLLECTION.doc(invitationId).get();

    if (!doc.exists) {
        console.log('[INVITE] Invitation not found', { invitationId });
        return null;
    }

    const invitation = doc.data() as Invitation;

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(invitation.expiresAt);

    if (now > expiresAt && invitation.status === 'pending') {
        console.log('[INVITE] Invitation has expired', { invitationId });
        // Update status to expired
        await INVITATIONS_COLLECTION.doc(invitationId).update({ status: 'expired' });
        invitation.status = 'expired';
    }

    return invitation;
};

/**
 * Accept an invitation and create bidirectional relationship
 * @param data - Data for accepting the invitation
 */
export const acceptInvitation = async (data: AcceptInvitationData) => {
    const { invitationId, acceptingUserId, acceptingUserRole } = data;

    console.log('[INVITE] Accepting invitation', { invitationId, acceptingUserId, acceptingUserRole });

    // Get the invitation
    const invitation = await getInvitationById(invitationId);

    if (!invitation) {
        throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
        throw new Error(`Invitation is ${invitation.status} and cannot be accepted`);
    }

    // Validate roles are opposite
    const expectedAcceptingRole: UserRole = invitation.inviterRole === 'parent' ? 'child' : 'parent';
    if (acceptingUserRole !== expectedAcceptingRole) {
        throw new Error(`Invalid role. Expected ${expectedAcceptingRole} but got ${acceptingUserRole}`);
    }

    // Prevent self-invitation
    if (invitation.inviterId === acceptingUserId) {
        throw new Error('Cannot accept your own invitation');
    }

    // Use Firestore batch for atomic operations
    const batch = firestore().batch();

    // 1. Update invitation status
    const invitationRef = INVITATIONS_COLLECTION.doc(invitationId);
    batch.update(invitationRef, {
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
        acceptedByUserId: acceptingUserId,
    });

    // 2. Update relationships
    const inviterRef = USERS_COLLECTION.doc(invitation.inviterId);
    const accepterRef = USERS_COLLECTION.doc(acceptingUserId);

    if (invitation.inviterRole === 'parent') {
        // Parent invited child
        // Add child to parent's linkedChildrenIds
        batch.update(inviterRef, {
            linkedChildrenIds: firestore.FieldValue.arrayUnion(acceptingUserId),
            updatedAt: new Date().toISOString(),
        });

        // Add parent to child's linkedParentsIds
        batch.update(accepterRef, {
            linkedParentsIds: firestore.FieldValue.arrayUnion(invitation.inviterId),
            updatedAt: new Date().toISOString(),
        });
    } else {
        // Child invited parent
        // Add parent to child's linkedParentsIds
        batch.update(inviterRef, {
            linkedParentsIds: firestore.FieldValue.arrayUnion(acceptingUserId),
            updatedAt: new Date().toISOString(),
        });

        // Add child to parent's linkedChildrenIds
        batch.update(accepterRef, {
            linkedChildrenIds: firestore.FieldValue.arrayUnion(invitation.inviterId),
            updatedAt: new Date().toISOString(),
        });
    }

    // Commit all changes atomically
    await batch.commit();
    console.log('[INVITE] Invitation accepted and relationships created', { invitationId });

    return invitation;
};

/**
 * Reject an invitation
 * @param invitationId - The invitation ID to reject
 */
export const rejectInvitation = async (invitationId: string) => {
    console.log('[INVITE] Rejecting invitation', { invitationId });

    const invitation = await getInvitationById(invitationId);

    if (!invitation) {
        throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
        throw new Error(`Invitation is ${invitation.status} and cannot be rejected`);
    }

    await INVITATIONS_COLLECTION.doc(invitationId).update({
        status: 'rejected',
    });

    console.log('[INVITE] Invitation rejected', { invitationId });
};

/**
 * Get all invitations created by a user
 * @param userId - The user ID
 * @param status - Optional status filter
 * @returns Array of invitations
 */
export const getUserInvitations = async (
    userId: string,
    status?: InvitationStatus
): Promise<Invitation[]> => {
    console.log('[INVITE] Fetching user invitations', { userId, status });

    let query = INVITATIONS_COLLECTION.where('inviterId', '==', userId);

    if (status) {
        query = query.where('status', '==', status);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();

    const invitations: Invitation[] = [];
    snapshot.forEach(doc => {
        invitations.push(doc.data() as Invitation);
    });

    console.log('[INVITE] Found invitations', { count: invitations.length });
    return invitations;
};

/**
 * Get pending invitations for a specific email
 * @param email - The email to search for
 * @returns Array of pending invitations
 */
export const getPendingInvitationsForEmail = async (email: string): Promise<Invitation[]> => {
    console.log('[INVITE] Fetching pending invitations for email', { email });

    const snapshot = await INVITATIONS_COLLECTION
        .where('inviteeEmail', '==', email)
        .where('status', '==', 'pending')
        .get();

    const invitations: Invitation[] = [];
    snapshot.forEach(doc => {
        invitations.push(doc.data() as Invitation);
    });

    console.log('[INVITE] Found pending invitations', { count: invitations.length });
    return invitations;
};

/**
 * Cancel/delete a pending invitation (for the inviter)
 * @param invitationId - The invitation ID
 * @param userId - The user requesting cancellation (must be inviter)
 */
export const cancelInvitation = async (invitationId: string, userId: string) => {
    console.log('[INVITE] Canceling invitation', { invitationId, userId });

    const invitation = await getInvitationById(invitationId);

    if (!invitation) {
        throw new Error('Invitation not found');
    }

    if (invitation.inviterId !== userId) {
        throw new Error('You can only cancel your own invitations');
    }

    if (invitation.status !== 'pending') {
        throw new Error('Only pending invitations can be canceled');
    }

    await INVITATIONS_COLLECTION.doc(invitationId).delete();
    console.log('[INVITE] Invitation canceled', { invitationId });
};

/**
 * Remove a relationship between parent and child
 * @param parentId - Parent user ID
 * @param childId - Child user ID
 */
export const removeRelationship = async (parentId: string, childId: string) => {
    console.log('[INVITE] Removing relationship', { parentId, childId });

    const batch = firestore().batch();

    const parentRef = USERS_COLLECTION.doc(parentId);
    const childRef = USERS_COLLECTION.doc(childId);

    batch.update(parentRef, {
        linkedChildrenIds: firestore.FieldValue.arrayRemove(childId),
        updatedAt: new Date().toISOString(),
    });

    batch.update(childRef, {
        linkedParentsIds: firestore.FieldValue.arrayRemove(parentId),
        updatedAt: new Date().toISOString(),
    });

    await batch.commit();
    console.log('[INVITE] Relationship removed', { parentId, childId });
};
