'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Tag, Car, Package, FolderTree } from 'lucide-react';

export default function AdminPage() {
  const adminSections = [
    {
      title: 'Vehicle Brands',
      description: 'Manage vehicle manufacturers',
      icon: Tag,
      href: '/admin/brands',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Vehicle Models',
      description: 'Manage vehicle models',
      icon: Car,
      href: '/admin/models',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Body Types',
      description: 'Manage vehicle body types',
      icon: Package,
      href: '/admin/body-types',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Categories',
      description: 'Manage ad categories',
      icon: FolderTree,
      href: '/admin/categories',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your marketplace data and configurations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminSections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className={`p-3 rounded-xl inline-flex mb-4 ${section.color}`}>
                    <section.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
