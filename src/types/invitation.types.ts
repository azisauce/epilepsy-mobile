import { UserRole } from './user.types';

/**
 * Status of an invitation
 */
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

/**
 * Invitation document structure
 */
export interface Invitation {
    id: string;                    // Unique invitation ID (also used in link)
    inviterRole: UserRole;         // Role of person sending invite ('parent' or 'child')
    inviterId: string;             // User ID of person sending invite
    inviterName: string;           // Full name for display purposes
    inviteeEmail?: string;         // Optional: target email if known
    status: InvitationStatus;      // Current status of invitation
    createdAt: string;             // ISO timestamp when created
    expiresAt: string;             // ISO timestamp when invitation expires
    acceptedAt?: string;           // ISO timestamp when accepted (if applicable)
    acceptedByUserId?: string;     // User ID who accepted the invite
}

/**
 * Data required to create a new invitation
 */
export interface CreateInvitationData {
    inviterId: string;
    inviterRole: UserRole;
    inviterName: string;
    inviteeEmail?: string;
    expirationDays?: number;       // Optional: defaults to 7 days
}

/**
 * Data for accepting an invitation
 */
export interface AcceptInvitationData {
    invitationId: string;
    acceptingUserId: string;
    acceptingUserRole: UserRole;
}
