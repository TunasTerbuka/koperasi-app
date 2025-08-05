import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Coins,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function MemberCard({ member }) {
  const memberTypeColors = {
    founding: "bg-purple-100 text-purple-800 border-purple-200",
    regular: "bg-blue-100 text-blue-800 border-blue-200",
    honorary: "bg-green-100 text-green-800 border-green-200"
  };

  const memberTypeLabels = {
    founding: "Pendiri",
    regular: "Biasa",
    honorary: "Kehormatan"
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{member.full_name}</h3>
              <p className="text-sm text-gray-500">ID: {member.member_id}</p>
            </div>
          </div>
          {member.active_status ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>

        <div className="space-y-3">
          <Badge className={`${memberTypeColors[member.member_type]} border`}>
            {memberTypeLabels[member.member_type]}
          </Badge>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{member.village_address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{member.phone_number}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Bergabung: {format(new Date(member.join_date), "d MMM yyyy", { locale: id })}
              </span>
            </div>
            {member.total_contributions > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Coins className="w-4 h-4" />
                <span>
                  Kontribusi: Rp {member.total_contributions.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Terdaftar: {format(new Date(member.created_date), "d MMM yyyy", { locale: id })}
            </span>
            <Badge variant={member.active_status ? "default" : "secondary"} className="text-xs">
              {member.active_status ? "Aktif" : "Tidak Aktif"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
