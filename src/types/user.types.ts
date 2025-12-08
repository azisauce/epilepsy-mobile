export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  dateOfBirth?: string;
  diagnosisDate?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}