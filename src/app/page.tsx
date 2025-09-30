'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTaskStatistics, getRecentActivity } from '@/lib/store';
import { RecentActivity } from '@/lib/types';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStats(getTaskStatistics());
    setRecentActivity(getRecentActivity());
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase mb-2">Total Tasks</h3>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase mb-2">Completed Tasks</h3>
          <p className="text-3xl sm:text-4xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase mb-2">In-Progress Tasks</h3>
          <p className="text-3xl sm:text-4xl font-bold text-orange-600">{stats.inProgress}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">{activity.taskTitle}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {activity.action} by {activity.userName}
                  </p>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 sm:ml-2">{formatTimestamp(activity.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Task Button */}
      <div className="flex justify-center">
        <Link
          href="/tasks/create"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
        >
          Create New Task
        </Link>
      </div>
    </div>
  );
}