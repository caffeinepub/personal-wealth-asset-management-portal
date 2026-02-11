import { useState } from 'react';
import { useListProperties } from '@/features/properties/api';
import PropertyFormCard from '@/features/properties/components/PropertyFormCard';
import PropertyCardGrid from '@/features/properties/components/PropertyCardGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Property } from '@/backend';

export default function PropertyLedgerPage() {
  const { data: properties, isLoading } = useListProperties();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const handleEditSuccess = () => {
    setEditingProperty(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Property & Real Estate Ledger</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your real estate portfolio
        </p>
      </div>

      <PropertyFormCard editingProperty={editingProperty} onSuccess={handleEditSuccess} />

      {properties && properties.length > 0 && (
        <PropertyCardGrid properties={properties} onEdit={setEditingProperty} />
      )}

      {properties && properties.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No properties yet. Add your first property above to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
