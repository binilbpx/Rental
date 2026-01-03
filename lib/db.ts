import { User, Property, Offer, Agreement } from '@/types';

class InMemoryDB {
  private users: Map<number, User> = new Map();
  private properties: Map<number, Property> = new Map();
  private offers: Map<number, Offer> = new Map();
  private agreements: Map<number, Agreement> = new Map();
  
  private nextUserId = 1;
  private nextPropertyId = 1;
  private nextOfferId = 1;
  private nextAgreementId = 1;

  // User methods
  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: this.nextUserId++,
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  getUser(id: number): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  updateUser(id: number, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Initialize with predefined users
  initializeDefaultUsers() {
    // Only initialize if no users exist
    if (this.users.size === 0) {
      // Predefined Owner
      this.createUser({
        role: 'owner',
        name: 'John Owner',
        email: 'owner@rentchain.com',
        password: 'owner123',
      });

      // Predefined Tenant
      this.createUser({
        role: 'tenant',
        name: 'Jane Tenant',
        email: 'tenant@rentchain.com',
        password: 'tenant123',
      });

      // Reset counters to start from 3
      this.nextUserId = 3;
    }
  }

  // Initialize with test properties
  initializeTestProperties() {
    // Only initialize if no properties exist
    if (this.properties.size === 0) {
      const owner = this.getUserByEmail('owner@rentchain.com');
      if (!owner) return;

      // Test Property 1: Modern Apartment
      this.createProperty({
        ownerId: owner.id,
        title: 'Modern 2BR Apartment in Downtown',
        description: 'Beautiful modern apartment with stunning city views. Features include hardwood floors, updated kitchen with stainless steel appliances, and a spacious balcony. Perfect location near shopping, dining, and public transportation.',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
        price: 1800,
        location: 'Downtown, New York',
        bedrooms: 2,
        bathrooms: 1,
      });

      // Test Property 2: Cozy Studio
      this.createProperty({
        ownerId: owner.id,
        title: 'Cozy Studio Apartment',
        description: 'Charming studio apartment in a quiet neighborhood. Recently renovated with new appliances and fixtures. Great for students or young professionals. Includes utilities and high-speed internet.',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
        price: 950,
        location: 'Brooklyn, New York',
        bedrooms: 0,
        bathrooms: 1,
      });

      // Test Property 3: Luxury Condo
      this.createProperty({
        ownerId: owner.id,
        title: 'Luxury 3BR Condo with Amenities',
        description: 'Spacious luxury condo in premium building. Features include floor-to-ceiling windows, gourmet kitchen, master suite with walk-in closet, and access to building amenities including gym, pool, and rooftop terrace.',
        images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        price: 3200,
        location: 'Manhattan, New York',
        bedrooms: 3,
        bathrooms: 2,
      });

      // Test Property 4: Family Home
      this.createProperty({
        ownerId: owner.id,
        title: 'Spacious 4BR Family Home',
        description: 'Perfect family home with large backyard and two-car garage. Features include updated kitchen, formal dining room, home office, and finished basement. Located in family-friendly neighborhood with excellent schools nearby.',
        images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
        price: 2800,
        location: 'Queens, New York',
        bedrooms: 4,
        bathrooms: 2.5,
      });

      // Test Property 5: Penthouse Suite
      this.createProperty({
        ownerId: owner.id,
        title: 'Penthouse Suite with Panoramic Views',
        description: 'Stunning penthouse with breathtaking city views from every room. Features include private elevator access, chef\'s kitchen, wine cellar, and expansive terrace. Perfect for entertaining or luxury living.',
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'],
        price: 5500,
        location: 'Manhattan, New York',
        bedrooms: 3,
        bathrooms: 3,
      });

      // Test Property 6: Budget-Friendly 1BR
      this.createProperty({
        ownerId: owner.id,
        title: 'Affordable 1BR Apartment',
        description: 'Well-maintained one-bedroom apartment in a safe, convenient location. Close to public transport, grocery stores, and restaurants. Pet-friendly building with on-site laundry facilities.',
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
        price: 1200,
        location: 'Bronx, New York',
        bedrooms: 1,
        bathrooms: 1,
      });

      // Reset property counter to start from 7
      this.nextPropertyId = 7;
    }
  }

  // Property methods
  createProperty(property: Omit<Property, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Property {
    const newProperty: Property = {
      ...property,
      id: this.nextPropertyId++,
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(newProperty.id, newProperty);
    return newProperty;
  }

  getProperty(id: number): Property | undefined {
    return this.properties.get(id);
  }

  getAllProperties(filters?: {
    ownerId?: number;
    status?: 'OPEN' | 'AGREED';
    minPrice?: number;
    maxPrice?: number;
  }): Property[] {
    let properties = Array.from(this.properties.values());
    
    if (filters) {
      if (filters.ownerId) {
        properties = properties.filter(p => p.ownerId === filters.ownerId);
      }
      if (filters.status) {
        properties = properties.filter(p => p.status === filters.status);
      }
      if (filters.minPrice !== undefined) {
        properties = properties.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
      }
    }
    
    return properties;
  }

  updateProperty(id: number, updates: Partial<Property>): Property | undefined {
    const property = this.properties.get(id);
    if (!property) return undefined;
    const updated = { ...property, ...updates, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  // Offer methods
  createOffer(offer: Omit<Offer, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Offer {
    const newOffer: Offer = {
      ...offer,
      id: this.nextOfferId++,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.offers.set(newOffer.id, newOffer);
    return newOffer;
  }

  getOffer(id: number): Offer | undefined {
    return this.offers.get(id);
  }

  getOffersByProperty(propertyId: number): Offer[] {
    return Array.from(this.offers.values()).filter(o => o.propertyId === propertyId);
  }

  getOffersByTenant(tenantId: number): Offer[] {
    return Array.from(this.offers.values()).filter(o => o.tenantId === tenantId);
  }

  updateOffer(id: number, updates: Partial<Offer>): Offer | undefined {
    const offer = this.offers.get(id);
    if (!offer) return undefined;
    const updated = { ...offer, ...updates, updatedAt: new Date() };
    this.offers.set(id, updated);
    return updated;
  }

  // Agreement methods
  createAgreement(agreement: Omit<Agreement, 'id' | 'status' | 'createdAt'>): Agreement {
    const newAgreement: Agreement = {
      ...agreement,
      id: this.nextAgreementId++,
      status: 'READY_TO_SIGN',
      createdAt: new Date(),
    };
    this.agreements.set(newAgreement.id, newAgreement);
    return newAgreement;
  }

  getAgreement(id: number): Agreement | undefined {
    return this.agreements.get(id);
  }

  getAgreementsByUser(userId: number): Agreement[] {
    return Array.from(this.agreements.values()).filter(
      a => a.ownerId === userId || a.tenantId === userId
    );
  }

  updateAgreement(id: number, updates: Partial<Agreement>): Agreement | undefined {
    const agreement = this.agreements.get(id);
    if (!agreement) return undefined;
    const updated = { ...agreement, ...updates };
    this.agreements.set(id, updated);
    return updated;
  }
}

// Singleton instance
const db = new InMemoryDB();

// Initialize default users and test properties on module load
db.initializeDefaultUsers();
db.initializeTestProperties();

export default db;

