export type UserRole = 'admin' | 'parent' | 'child';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Parent extends User {
  linkedChildrenIds: string[];
}

export interface Child extends User {
  linkedParentsIds: string[];
}