'use client';

import { useRouter } from 'next/navigation';
import { StoreForm } from '@/components/store/store-form';
import { useCreateStore } from '@/lib/hooks/use-stores';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateStorePage() {
  const router = useRouter();
  const createMutation = useCreateStore();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/stores');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/stores"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stores
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create a New Store</CardTitle>
            <p className="text-gray-500 mt-1">
              Fill in the details below to register your dealership
            </p>
          </CardHeader>
          <CardContent>
            <StoreForm
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
