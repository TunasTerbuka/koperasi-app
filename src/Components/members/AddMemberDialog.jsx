import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, X } from "lucide-react";

export default function AddMemberDialog({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    full_name: "",
    village_address: "",
    phone_number: "",
    member_id: "",
    join_date: new Date().toISOString().split('T')[0],
    member_type: "regular",
    active_status: true
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        full_name: "",
        village_address: "",
        phone_number: "",
        member_id: "",
        join_date: new Date().toISOString().split('T')[0],
        member_type: "regular",
        active_status: true
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            Tambah Anggota Baru
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member_id">ID Anggota</Label>
            <Input
              id="member_id"
              value={formData.member_id}
              onChange={(e) => handleChange('member_id', e.target.value)}
              placeholder="Contoh: KOP001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="village_address">Alamat Desa</Label>
            <Input
              id="village_address"
              value={formData.village_address}
              onChange={(e) => handleChange('village_address', e.target.value)}
              placeholder="Masukkan alamat lengkap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Nomor Telepon</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              placeholder="Contoh: 08123456789"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="join_date">Tanggal Bergabung</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                onChange={(e) => handleChange('join_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member_type">Jenis Anggota</Label>
              <Select
                value={formData.member_type}
                onValueChange={(value) => handleChange('member_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Anggota Biasa</SelectItem>
                  <SelectItem value="founding">Anggota Pendiri</SelectItem>
                  <SelectItem value="honorary">Anggota Kehormatan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
