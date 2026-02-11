import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Entry, EntryType } from '@/backend';
import { formatInr } from '@/utils/currency';

interface EntriesTableProps {
  entries: Entry[];
  isLoading?: boolean;
}

export default function EntriesTable({ entries, isLoading }: EntriesTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Betting Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Loading entries...</p>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Betting Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No entries yet. Add your first betting entry above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betting Entries ({entries.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Favorite Team</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Bet Amount</TableHead>
                <TableHead>Bookie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id.toString()}>
                  <TableCell className="text-sm">
                    {new Date(Number(entry.createdAt) / 1000000).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{entry.favoriteTeam}</TableCell>
                  <TableCell>
                    <Badge variant={entry.entryType === EntryType.back ? 'default' : 'secondary'}>
                      {entry.entryType === EntryType.back ? 'Back' : 'Lay'}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.rate.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">{formatInr(entry.amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.bookieName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
