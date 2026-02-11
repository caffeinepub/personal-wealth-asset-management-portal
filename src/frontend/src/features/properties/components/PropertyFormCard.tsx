import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAddOrUpdateProperty } from '../api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '@/backend';

interface PropertyFormCardProps {
  editingProperty?: Property | null;
  onSuccess?: () => void;
}

export default function PropertyFormCard({ editingProperty, onSuccess }: PropertyFormCardProps) {
  const [location, setLocation] = useState('');
  const [landArea, setLandArea] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');

  const addOrUpdateMutation = useAddOrUpdateProperty();

  useEffect(() => {
    if (editingProperty) {
      setLocation(editingProperty.location);
      setLandArea(editingProperty.landArea.toString());
      setPurchasePrice(editingProperty.purchasePrice.toString());
      const date = new Date(Number(editingProperty.acquisitionDate) / 1000000);
      setAcquisitionDate(date.toISOString().split('T')[0]);
    }
  }, [editingProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const landAreaNum = parseFloat(landArea);
    const purchasePriceNum = parseFloat(purchasePrice);

    if (landAreaNum <= 0 || purchasePriceNum <= 0) {
      toast.error('Please enter valid positive numbers');
      return;
    }

    const dateObj = new Date(acquisitionDate);
    const acquisitionDateNano = BigInt(dateObj.getTime()) * BigInt(1000000);

    try {
      await addOrUpdateMutation.mutateAsync({
        id: editingProperty?.id,
        location: location.trim(),
        landArea: landAreaNum,
        purchasePrice: purchasePriceNum,
        acquisitionDate: acquisitionDateNano,
      });

      toast.success(editingProperty ? 'Property updated successfully' : 'Property added successfully');
      
      // Reset form
      setLocation('');
      setLandArea('');
      setPurchasePrice('');
      setAcquisitionDate('');
      
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save property');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location / Address</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="123 Main St, City, State"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="landArea">Land Area (sq. ft)</Label>
              <Input
                id="landArea"
                type="number"
                step="0.01"
                min="0"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder="2500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="250000.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="acquisitionDate">Date of Acquisition</Label>
            <Input
              id="acquisitionDate"
              type="date"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={addOrUpdateMutation.isPending}>
            {addOrUpdateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : editingProperty ? (
              'Update Property'
            ) : (
              'Add Property'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
