'use client';

import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { data: aggregates, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getAggregates(),
  });

  const cards = [
    {
      title: 'Total Balance',
      amount: aggregates?.balance || 0,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Income',
      amount: aggregates?.totalIncome || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Expense',
      amount: aggregates?.totalExpense || 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your financial aggregates.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                  <div className={`p-3 rounded-full ${card.bgColor} ${card.color} mr-4`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${Number(card.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
