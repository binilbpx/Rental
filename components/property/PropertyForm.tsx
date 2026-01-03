'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreatePropertyDto } from '@/types';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  location: z.string().optional(),
  bedrooms: z.number().int().positive().optional().or(z.literal('')),
  bathrooms: z.number().int().positive().optional().or(z.literal('')),
});

interface PropertyFormProps {
  ownerId: number;
  onSubmit: (data: CreatePropertyDto) => Promise<void>;
}

export default function PropertyForm({ ownerId, onSubmit }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(propertySchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const uploadFiles = async () => {
    setUploading(true);
    const uploadedImageUrls: string[] = [];
    let uploadedVideoUrl = '';

    try {
      // Upload images
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('type', 'image');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedImageUrls.push(data.url);
        }
      }

      // Upload video if present
      if (video) {
        const formData = new FormData();
        formData.append('file', video);
        formData.append('type', 'video');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedVideoUrl = data.url;
        }
      }

      setImageUrls(uploadedImageUrls);
      setVideoUrl(uploadedVideoUrl);
      return { images: uploadedImageUrls, videoUrl: uploadedVideoUrl };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Upload files first
      const { images: uploadedImages, videoUrl: uploadedVideoUrl } = await uploadFiles();

      if (uploadedImages.length === 0) {
        alert('Please upload at least one image');
        setIsSubmitting(false);
        return;
      }

      const propertyData: CreatePropertyDto = {
        ownerId,
        title: data.title,
        description: data.description,
        images: uploadedImages,
        videoUrl: uploadedVideoUrl || undefined,
        price: parseFloat(data.price),
        location: data.location || undefined,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
      };
      await onSubmit(propertyData);
      reset();
      setImages([]);
      setVideo(null);
      setImageUrls([]);
      setVideoUrl('');
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Create Property Listing</h2>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Title *
          </label>
          <input
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Images * (Select multiple)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">{images.length} image(s) selected</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Video (optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          {video && (
            <p className="text-sm text-gray-600 mt-2">{video.name} selected</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Price (per month) *
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Location
            </label>
            <input
              {...register('location')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bedrooms
            </label>
            <input
              {...register('bedrooms', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bathrooms
            </label>
            <input
              {...register('bathrooms', { valueAsNumber: true })}
              type="number"
              min="1"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting || uploading} className="w-full">
          {uploading ? 'Uploading...' : isSubmitting ? 'Creating...' : 'Create Property'}
        </Button>
      </form>
    </Card>
  );
}
