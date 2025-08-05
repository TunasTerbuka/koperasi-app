import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Users, Coins, Package, Vote } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Tambah Anggota",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      href: createPageUrl("Members")
    },
    {
      title: "Catat Kontribusi",
      icon: Coins,
      color: "from-green-500 to-green-600",
      href: createPageUrl("Contributions")
    },
    {
      title: "Kelola Sumber Daya",
      icon: Package,
      color: "from-orange-500 to-orange-600",
      href: createPageUrl("Resources")
    },
    {
      title: "Buat Pemungutan Suara",
      icon: Vote,
      color: "from-purple-500 to-purple-600",
      href: createPageUrl("Voting")
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5 text-gray-600" />
          Aksi Cepat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.href} className="block">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200"
              >
                <div className={`p-2 bg-gradient-to-br ${action.color} rounded-lg`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {action.title}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
