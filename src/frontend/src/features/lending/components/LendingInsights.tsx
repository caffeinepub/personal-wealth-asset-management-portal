import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatInr } from '@/utils/currency';
import type { Loan } from '@/backend';

interface LendingInsightsProps {
  loans: Loan[];
}

const COLORS = ['oklch(0.68 0.18 160)', 'oklch(0.75 0.14 85)'];

export default function LendingInsights({ loans }: LendingInsightsProps) {
  // Calculate monthly interest income
  const monthlyInterestData = loans.map((loan) => {
    const rate = loan.interestRate / 100;
    const monthlyInterest = loan.termMonthly 
      ? loan.principal * rate
      : (loan.principal * rate) / 12;
    
    return {
      name: loan.borrowerName,
      interest: monthlyInterest,
    };
  });

  // Calculate principal vs total interest (tenure-aware)
  const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principal, 0);
  const totalInterest = loans.reduce((sum, loan) => {
    const rate = loan.interestRate / 100;
    const interestPerPeriod = loan.principal * rate;
    const totalInterestForLoan = interestPerPeriod * loan.loanTenure;
    return sum + totalInterestForLoan;
  }, 0);

  const principalVsInterestData = [
    { name: 'Principal', value: totalPrincipal },
    { name: 'Interest', value: totalInterest },
  ];

  if (loans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Add loans to see insights and analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Monthly Interest Income Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Interest Income</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyInterestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 240)" />
              <XAxis 
                dataKey="name" 
                stroke="oklch(0.65 0.01 240)"
                tick={{ fill: 'oklch(0.65 0.01 240)' }}
              />
              <YAxis 
                stroke="oklch(0.65 0.01 240)"
                tick={{ fill: 'oklch(0.65 0.01 240)' }}
              />
              <Tooltip
                formatter={(value: number) => formatInr(value)}
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.015 240)',
                  border: '1px solid oklch(0.25 0.02 240)',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="interest" fill="oklch(0.68 0.18 160)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Principal vs Interest Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Principal vs Total Interest</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={principalVsInterestData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {principalVsInterestData.map((entry, index) => (
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
    </div>
  );
}
