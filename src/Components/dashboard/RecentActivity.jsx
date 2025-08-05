import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Receipt, Vote, Clock } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function RecentActivity({ activities, loading }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'contribution': return Coins;
      case 'transaction': return Receipt;
      case 'vote': return Vote;
      default: return Clock;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'contribution': return 'bg-green-100 text-green-800';
      case 'transaction': return 'bg-blue-100 text-blue-800';
      case 'vote': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'contribution':
        return `Kontribusi ${activity.data.contribution_type} senilai Rp ${activity.data.amount?.toLocaleString('id-ID')}`;
      case 'transaction':
        return `${activity.data.transaction_type === 'income' ? 'Pemasukan' : 'Pengeluaran'} Rp ${activity.data.amount?.toLocaleString('id-ID')}`;
      case 'vote':
        return `Pemungutan suara: ${activity.data.title}`;
      default:
        return 'Aktivitas tidak dikenal';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="w-5 h-5 text-gray-600" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada aktivitas terbaru</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(activity.timestamp), "d MMMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
