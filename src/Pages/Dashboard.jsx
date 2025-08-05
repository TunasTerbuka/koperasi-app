import React, { useState, useEffect } from "react";
import { Member, Contribution, Transaction, Resource, Vote } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Package, 
  Vote as VoteIcon,
  Plus,
  Activity,
  DollarSign,
  PieChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import StatCard from "../Components/dashboard/StatCard";
import RecentActivity from "../Components/dashboard/RecentActivity";
import QuickActions from "../Components/dashboard/QuickActions";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalContributions: 0,
    totalTransactions: 0,
    availableResources: 0,
    activeVotes: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [members, contributions, transactions, resources, votes] = await Promise.all([
        Member.list('-created_date', 100),
        Contribution.list('-created_date', 10),
        Transaction.list('-created_date', 10),
        Resource.list('-created_date', 100),
        Vote.list('-created_date', 100)
      ]);

      setStats({
        totalMembers: members.length,
        totalContributions: contributions.reduce((sum, c) => sum + (c.amount || 0), 0),
        totalTransactions: transactions.length,
        availableResources: resources.filter(r => r.availability).length,
        activeVotes: votes.filter(v => v.status === 'active').length
      });

      // Combine recent activities
      const activities = [
        ...contributions.slice(0, 3).map(c => ({
          type: 'contribution',
          data: c,
          timestamp: c.created_date
        })),
        ...transactions.slice(0, 3).map(t => ({
          type: 'transaction',
          data: t,
          timestamp: t.created_date
        })),
        ...votes.slice(0, 2).map(v => ({
          type: 'vote',
          data: v,
          timestamp: v.created_date
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Koperasi Desa
          </h1>
          <p className="text-gray-600 text-lg">
            Sistem manajemen koperasi berbasis blockchain untuk transparansi dan akuntabilitas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Anggota"
            value={stats.totalMembers}
            icon={Users}
            bgColor="from-blue-500 to-blue-600"
            textColor="text-blue-600"
            loading={loading}
          />
          <StatCard
            title="Total Kontribusi"
            value={`Rp ${stats.totalContributions.toLocaleString('id-ID')}`}
            icon={Coins}
            bgColor="from-green-500 to-green-600"
            textColor="text-green-600"
            loading={loading}
          />
          <StatCard
            title="Transaksi"
            value={stats.totalTransactions}
            icon={Activity}
            bgColor="from-purple-500 to-purple-600"
            textColor="text-purple-600"
            loading={loading}
          />
          <StatCard
            title="Sumber Daya"
            value={stats.availableResources}
            icon={Package}
            bgColor="from-orange-500 to-orange-600"
            textColor="text-orange-600"
            loading={loading}
          />
          <StatCard
            title="Pemungutan Suara"
            value={stats.activeVotes}
            icon={VoteIcon}
            bgColor="from-red-500 to-red-600"
            textColor="text-red-600"
            loading={loading}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <RecentActivity 
              activities={recentActivities}
              loading={loading}
            />
          </div>

          {/* Quick Actions & Progress */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Progress Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Progress Tahunan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Target Dana Koperasi</span>
                    <span className="font-semibold">
                      {Math.round((stats.totalContributions / 100000000) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(stats.totalContributions / 100000000) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Target: Rp 100,000,000
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Anggota Aktif</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalMembers} dari target 120 anggota
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Status */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  Status Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Network</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Block</span>
                    <span className="text-sm font-mono">#1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hash Rate</span>
                    <span className="text-sm font-mono">98.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
