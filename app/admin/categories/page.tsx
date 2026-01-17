'use client';

import { useState } from 'react';
import { useCategories, useCreateCategory } from '@/lib/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingPage } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Modal } from '@/components/ui/modal';
import { FolderTree, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const { data: categories = [], isLoading, error, refetch } = useCategories();
  const createMutation = useCreateCategory();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({ name: '' });
        refetch();
      },
    });
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FolderTree className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Ad Categories</h1>
                <p className="text-gray-500 mt-1">
                  Manage advertisement categories ({categories.length} total)
                </p>
              </div>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <FolderTree className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-xs text-gray-500">ID: {category.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Category"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., New Cars, Used Cars, Classic"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
