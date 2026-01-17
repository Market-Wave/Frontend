'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/components/vehicle/vehicle-card';
import { useVehicleAds } from '@/lib/hooks/use-vehicle-ads';
import { Car, Store, TrendingUp, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  const { data: vehicles = [] } = useVehicleAds();
  const featuredVehicles = vehicles.slice(0, 6);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Vehicle
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Browse thousands of vehicles from trusted dealerships and private sellers
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/vehicles">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Browse Vehicles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/vehicles/create">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Sell Your Vehicle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of vehicles from all major brands and models
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Sellers</h3>
              <p className="text-gray-600">
                Verified dealerships and private sellers you can trust
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing and great deals on quality vehicles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      {featuredVehicles.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Featured Vehicles</h2>
                <p className="text-gray-600 mt-1">Check out our latest listings</p>
              </div>
              <Link href="/vehicles">
                <Button variant="outline">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Store className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Are you a dealership?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Register your dealership and reach thousands of potential buyers
          </p>
          <Link href="/stores/create">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Register Your Dealership
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
