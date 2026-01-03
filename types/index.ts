export type UserRole = "owner" | "tenant";
export type PropertyStatus = "OPEN" | "AGREED";
export type OfferStatus = "PENDING" | "COUNTERED" | "ACCEPTED" | "REJECTED";
export type AgreementStatus = "READY_TO_SIGN" | "SIGNED";

export interface User {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  password?: string; // Optional - not returned from API
  walletAddress?: string;
  createdAt: Date;
}

export interface Property {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  images: string[];
  videoUrl?: string;
  price: number;
  status: PropertyStatus;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: number;
  propertyId: number;
  tenantId: number;
  amount: number;
  status: OfferStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  previousOfferId?: number;
}

export interface Agreement {
  id: number;
  propertyId: number;
  ownerId: number;
  tenantId: number;
  finalAmount: number;
  status: AgreementStatus;
  ipfsHash?: string;
  txHash?: string;
  signedAt?: Date;
  createdAt: Date;
}

export interface CreateUserDto {
  role: UserRole;
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreatePropertyDto {
  ownerId: number;
  title: string;
  description: string;
  images: string[];
  videoUrl?: string;
  price: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface CreateOfferDto {
  propertyId: number;
  tenantId: number;
  amount: number;
  message?: string;
  previousOfferId?: number;
}

export interface CounterOfferDto {
  amount: number;
  message?: string;
}

export interface SignAgreementDto {
  walletAddress: string;
  signature?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}

