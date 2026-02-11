import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatInr } from '@/utils/currency';

interface WealthOverviewDonutProps {
  propertyValue: number;
  lendingPortfolio: number;
  wealthInputsTotal: number;
}

const COLORS = ['oklch(0.68 0.18 160)', 'oklch(0.75 0.14 85)', 'oklch(0.60 0.16 200)', 'oklch(0.72 0.12 120)'];

export default function WealthOverviewDonut({
  propertyValue,
  lendingPortfolio,
  wealthInputsTotal,
}: WealthOverviewDonutProps) {
  const data = [
    { name: 'Properties', value: propertyValue },
    { name: 'Lending Portfolio', value: lendingPortfolio },
    { name: 'Wealth Inputs', value: wealthInputsTotal },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No assets to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatInr(value)}
              contentStyle={{
                backgroundColor: 'oklch(0.16 0.015 240)',
                border: '1px solid oklch(0.25 0.02 240)',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
