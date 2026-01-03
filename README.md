# RENTCHAIN - Rental Platform POC

A Proof of Concept rental platform that enables direct negotiation and agreement signing between property owners and tenants, without brokers.

## Features

- Property listing and management
- Direct price negotiation between owners and tenants
- Multi-round offer/counter-offer system
- Blockchain-backed agreement signing
- IPFS document storage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: In-memory (JavaScript objects)
- **Blockchain**: Polygon Testnet (mock implementation for POC)
- **Storage**: IPFS (mock implementation for POC)
- **Wallet**: MetaMask integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your configuration (optional for POC)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
App/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── owner/             # Owner pages
│   ├── tenant/            # Tenant pages
│   └── properties/        # Property pages
├── components/            # React components
│   ├── common/           # Common components
│   ├── property/         # Property components
│   ├── offer/            # Offer components
│   ├── agreement/        # Agreement components
│   └── wallet/           # Wallet components
├── contexts/             # React contexts
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── README.md
```

## Usage

### For Property Owners

1. Register as an owner
2. Create property listings
3. View and manage offers from tenants
4. Accept, reject, or counter offers
5. Sign agreements on blockchain

### For Tenants

1. Register as a tenant
2. Browse available properties
3. Make offers on properties
4. Accept or reject counter-offers
5. Sign agreements on blockchain

## API Endpoints

See `RENTCHAIN_ARCHITECTURE_AND_FUNCTIONALITY.md` for complete API documentation.

## Notes

- This is a POC with in-memory database (data resets on server restart)
- Blockchain and IPFS integrations are mocked for demonstration
- No authentication - users identified by ID only
- No persistent storage

## Future Enhancements

- Replace in-memory DB with PostgreSQL/MongoDB
- Add authentication & authorization
- Integrate real blockchain and IPFS
- Add payment processing
- Implement notifications

