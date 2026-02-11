import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { getProfile, saveProfile } from '@/storage/profile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupDialog() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  const { data: userProfile, isLoading: profileLoading, isFetched } = useQuery({
    queryKey: queryKeys.userProfile.current(),
    queryFn: async () => {
      const profile = await getProfile();
      return profile ? { name: profile.name } : null;
    },
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async (profileName: string) => {
      await saveProfile(profileName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile.current() });
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await saveMutation.mutateAsync(name.trim());
    }
  };

  const showDialog = !profileLoading && isFetched && userProfile === null;

  return (
    <Dialog open={showDialog}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Your Wealth Portal</DialogTitle>
          <DialogDescription>
            Please enter your name to personalize your experience
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveMutation.isPending || !name.trim()}>
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
