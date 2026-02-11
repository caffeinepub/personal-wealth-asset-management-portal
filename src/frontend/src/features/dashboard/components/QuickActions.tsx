import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet, Building2 } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => navigate({ to: '/lending', search: { action: 'add' } })}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          <Wallet className="h-4 w-4" />
          Add New Loan
        </Button>
        <Button
          onClick={() => navigate({ to: '/properties', search: { action: 'add' } })}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          <Building2 className="h-4 w-4" />
          Add New Property
        </Button>
      </CardContent>
    </Card>
  );
}
