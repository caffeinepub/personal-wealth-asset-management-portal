import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAddOrUpdateWealthInput, useLatestWealthInput } from '../api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WealthInputsFormCard() {
  const [goldWeight, setGoldWeight] = useState('');
  const [goldValue, setGoldValue] = useState('');
  const [stocksValue, setStocksValue] = useState('');
  const [cashLiquid, setCashLiquid] = useState('');
  const [otherAssets, setOtherAssets] = useState('');

  const { data: latestInput } = useLatestWealthInput();
  const addOrUpdateMutation = useAddOrUpdateWealthInput();

  useEffect(() => {
    if (latestInput) {
      setGoldWeight(latestInput.goldWeight.toString());
      setGoldValue(latestInput.goldValue.toString());
      setStocksValue(latestInput.stocksValue.toString());
      setCashLiquid(latestInput.cashLiquid.toString());
      setOtherAssets(latestInput.otherAssets.toString());
    }
  }, [latestInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const goldWeightNum = parseFloat(goldWeight) || 0;
    const goldValueNum = parseFloat(goldValue) || 0;
    const stocksValueNum = parseFloat(stocksValue) || 0;
    const cashLiquidNum = parseFloat(cashLiquid) || 0;
    const otherAssetsNum = parseFloat(otherAssets) || 0;

    if (goldWeightNum < 0 || goldValueNum < 0 || stocksValueNum < 0 || cashLiquidNum < 0 || otherAssetsNum < 0) {
      toast.error('Please enter valid non-negative numbers');
      return;
    }

    try {
      await addOrUpdateMutation.mutateAsync({
        id: latestInput?.id,
        goldWeight: goldWeightNum,
        goldValue: goldValueNum,
        stocksValue: stocksValueNum,
        cashLiquid: cashLiquidNum,
        otherAssets: otherAssetsNum,
      });

      toast.success('Wealth inputs saved successfully');
    } catch (error) {
      toast.error('Failed to save wealth inputs');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Wealth Inputs</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goldWeight">Gold Weight (oz)</Label>
              <Input
                id="goldWeight"
                type="number"
                step="0.01"
                min="0"
                value={goldWeight}
                onChange={(e) => setGoldWeight(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goldValue">Gold Value (₹)</Label>
              <Input
                id="goldValue"
                type="number"
                step="0.01"
                min="0"
                value={goldValue}
                onChange={(e) => setGoldValue(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stocksValue">Stock Portfolio Value (₹)</Label>
            <Input
              id="stocksValue"
              type="number"
              step="0.01"
              min="0"
              value={stocksValue}
              onChange={(e) => setStocksValue(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cashLiquid">Liquid Cash (₹)</Label>
            <Input
              id="cashLiquid"
              type="number"
              step="0.01"
              min="0"
              value={cashLiquid}
              onChange={(e) => setCashLiquid(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherAssets">Other Assets (₹)</Label>
            <Input
              id="otherAssets"
              type="number"
              step="0.01"
              min="0"
              value={otherAssets}
              onChange={(e) => setOtherAssets(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <Button type="submit" className="w-full" disabled={addOrUpdateMutation.isPending}>
            {addOrUpdateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Wealth Inputs'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
