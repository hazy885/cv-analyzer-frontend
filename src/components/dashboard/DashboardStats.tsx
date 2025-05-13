import React from 'react';
import { Users, UserCheck, Award, Briefcase, TrendingUp, Clock, Calendar, Target, Mail } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    total: number;
    active: number;
    senior: number;
    newThisWeek: number;
    interviews: number;
    hired: number;
  };
  darkMode: boolean;
  activityPeriod: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, darkMode, activityPeriod }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <StatCard 
        title="Total Candidates"
        value={stats.total}
        icon={<Users className="h-5 w-5 text-blue-500" />}
        trend={{ value: 12, label: `from last ${activityPeriod}` }}
        darkMode={darkMode}
        color="blue"
      />
      
      <StatCard 
        title="Active Candidates"
        value={stats.active}
        icon={<UserCheck className="h-5 w-5 text-green-500" />}
        trend={{ value: 8, label: `from last ${activityPeriod}` }}
        darkMode={darkMode}
        color="green"
      />
      
      <StatCard 
        title="Senior Candidates"
        value={stats.senior}
        icon={<Award className="h-5 w-5 text-amber-500" />}
        subtitle="5+ years experience"
        darkMode={darkMode}
        color="amber"
      />
      
      <StatCard 
        title="New Applications"
        value={stats.newThisWeek}
        icon={<Calendar className="h-5 w-5 text-indigo-500" />}
        subtitle={`This ${activityPeriod}`}
        darkMode={darkMode}
        color="indigo"
      />
      
      <StatCard 
        title="Interviews"
        value={stats.interviews}
        icon={<Target className="h-5 w-5 text-blue-500" />}
        subtitle={`${Math.round(stats.interviews * 0.35)} scheduled today`}
        darkMode={darkMode}
        color="blue"
      />
      
      <StatCard 
        title="Hired"
        value={stats.hired}
        icon={<Mail className="h-5 w-5 text-purple-500" />}
        trend={{ value: 15, label: `from last ${activityPeriod}` }}
        darkMode={darkMode}
        color="purple"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  subtitle?: string;
  darkMode: boolean;
  color: 'blue' | 'green' | 'amber' | 'indigo' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  subtitle,
  darkMode,
  color
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-100',
          text: darkMode ? 'text-blue-400' : 'text-blue-600'
        };
      case 'green':
        return {
          bg: darkMode ? 'bg-green-900/30' : 'bg-green-100',
          text: darkMode ? 'text-green-400' : 'text-green-600'
        };
      case 'amber':
        return {
          bg: darkMode ? 'bg-amber-900/30' : 'bg-amber-100',
          text: darkMode ? 'text-amber-400' : 'text-amber-600'
        };
      case 'indigo':
        return {
          bg: darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100',
          text: darkMode ? 'text-indigo-400' : 'text-indigo-600'
        };
      case 'purple':
        return {
          bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-100',
          text: darkMode ? 'text-purple-400' : 'text-purple-600'
        };
      default:
        return {
          bg: darkMode ? 'bg-gray-800' : 'bg-gray-100',
          text: darkMode ? 'text-gray-400' : 'text-gray-600'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`p-5 rounded-xl ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
    } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
          {icon}
        </div>
      </div>
      <div className={`mt-2 text-xs ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {trend ? (
          <span className="inline-flex items-center text-green-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend.value}% growth
            <span className="ml-1">{trend.label}</span>
          </span>
        ) : subtitle ? (
          <span className={`inline-flex items-center ${colorClasses.text}`}>
            {color === 'amber' ? <Briefcase className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardStats;