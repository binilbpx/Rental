'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const offerSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  message: z.string().optional(),
});

interface OfferFormProps {
  propertyPrice: number;
  onSubmit: (amount: number, message?: string) => Promise<void>;
}

export default function OfferForm({ propertyPrice, onSubmit }: OfferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(offerSchema),
  });

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(parseFloat(data.amount), data.message || undefined);
      reset();
    } catch (error) {
      console.error('Failed to create offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Make an Offer</h3>
      <p className="text-gray-600 mb-4">Listed Price: ${propertyPrice}/month</p>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Your Offer ($/month) *
          </label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Message (optional)
          </label>
          <textarea
            {...register('message')}
            rows={3}
            placeholder="Add a message to the owner..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Offer'}
        </Button>
      </form>
    </Card>
  );
}

