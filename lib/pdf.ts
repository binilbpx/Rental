import jsPDF from 'jspdf';
import { Property, User, Agreement } from '@/types';

export async function generateAgreementPDF(
  property: Property,
  owner: User,
  tenant: User,
  agreement: Agreement
): Promise<Blob> {
  const pdf = new jsPDF();
  
  // Title
  pdf.setFontSize(20);
  pdf.text('RENTAL AGREEMENT', 105, 20, { align: 'center' });
  
  // Agreement Details
  pdf.setFontSize(12);
  let yPos = 40;
  
  pdf.text(`Agreement ID: ${agreement.id}`, 20, yPos);
  yPos += 10;
  
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
  yPos += 15;
  
  // Property Details
  pdf.setFontSize(14);
  pdf.text('PROPERTY DETAILS', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(12);
  pdf.text(`Title: ${property.title}`, 20, yPos);
  yPos += 7;
  
  if (property.location) {
    pdf.text(`Location: ${property.location}`, 20, yPos);
    yPos += 7;
  }
  
  if (property.bedrooms) {
    pdf.text(`Bedrooms: ${property.bedrooms}`, 20, yPos);
    yPos += 7;
  }
  
  if (property.bathrooms) {
    pdf.text(`Bathrooms: ${property.bathrooms}`, 20, yPos);
    yPos += 7;
  }
  
  pdf.text(`Description: ${property.description}`, 20, yPos);
  yPos += 15;
  
  // Parties
  pdf.setFontSize(14);
  pdf.text('PARTIES', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(12);
  pdf.text(`Owner: ${owner.name}`, 20, yPos);
  yPos += 7;
  
  if (owner.walletAddress) {
    pdf.text(`Wallet: ${owner.walletAddress}`, 20, yPos);
    yPos += 7;
  }
  
  pdf.text(`Tenant: ${tenant.name}`, 20, yPos);
  yPos += 7;
  
  if (tenant.walletAddress) {
    pdf.text(`Wallet: ${tenant.walletAddress}`, 20, yPos);
    yPos += 7;
  }
  
  yPos += 10;
  
  // Financial Terms
  pdf.setFontSize(14);
  pdf.text('FINANCIAL TERMS', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(12);
  pdf.text(`Monthly Rent: $${agreement.finalAmount}`, 20, yPos);
  yPos += 15;
  
  // Terms and Conditions
  pdf.setFontSize(14);
  pdf.text('TERMS AND CONDITIONS', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(10);
  const terms = [
    '1. This agreement is digitally signed and stored on blockchain.',
    '2. The IPFS hash ensures document integrity.',
    '3. Both parties agree to the terms stated above.',
    '4. This is a POC agreement for demonstration purposes.',
  ];
  
  terms.forEach(term => {
    pdf.text(term, 20, yPos);
    yPos += 7;
  });
  
  // Signature section
  yPos += 10;
  pdf.setFontSize(12);
  pdf.text('Signatures:', 20, yPos);
  yPos += 10;
  
  pdf.text(`Owner: ${owner.name}`, 20, yPos);
  yPos += 10;
  pdf.text('___________________', 20, yPos);
  
  yPos += 15;
  pdf.text(`Tenant: ${tenant.name}`, 20, yPos);
  yPos += 10;
  pdf.text('___________________', 20, yPos);
  
  // Convert to blob
  const blob = pdf.output('blob');
  return blob;
}

