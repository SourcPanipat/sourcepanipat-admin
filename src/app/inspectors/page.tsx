'use client';

import React, { useState } from 'react';
import { InspectorFieldAgent } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  Scale, 
  Plus, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Star, 
  Video, 
  Wallet, 
  X,
  Truck
} from 'lucide-react';

export default function AdminInspectorsPage() {
  const [inspectors, setInspectors] = useState<InspectorFieldAgent[]>([
    {
      id: 'insp-1',
      code: '#PNP-INSP-01',
      name: 'Vikram Singh',
      phone: '+91 98960 12345',
      assignedZone: 'Sanoli Road Godown Hub',
      activeInspectionsCount: 2,
      completedInspectionsCount: 148,
      rating: 4.95,
      status: 'on_ground',
      payoutPending: 4200,
      joinedDate: 'June 2026',
    },
    {
      id: 'insp-2',
      code: '#PNP-INSP-02',
      name: 'Deepak Malik',
      phone: '+91 98960 23456',
      assignedZone: 'Noorwala Industrial Area',
      activeInspectionsCount: 1,
      completedInspectionsCount: 92,
      rating: 4.88,
      status: 'on_ground',
      payoutPending: 2800,
      joinedDate: 'July 2026',
    },
    {
      id: 'insp-3',
      code: '#PNP-INSP-03',
      name: 'Amit Deswal',
      phone: '+91 98960 34567',
      assignedZone: 'Barsat Road Sorting Yard',
      activeInspectionsCount: 0,
      completedInspectionsCount: 64,
      rating: 4.92,
      status: 'available',
      payoutPending: 1500,
      joinedDate: 'July 2026',
    },
    {
      id: 'insp-4',
      code: '#PNP-INSP-04',
      name: 'Suresh Kaushik',
      phone: '+91 98960 45678',
      assignedZone: 'G.T. Road Transport Hub',
      activeInspectionsCount: 0,
      completedInspectionsCount: 110,
      rating: 4.98,
      status: 'available',
      payoutPending: 3300,
      joinedDate: 'May 2026',
    },
  ]);

  // Orders awaiting inspector allocation
  const [unassignedOrders, setUnassignedOrders] = useState([
    {
      orderNumber: 'SP-ESCROW-551980',
      baleTitle: 'Heavy Fleece 450 GSM Hoodies (100kg)',
      godownHub: 'Noorwala Industrial Area',
      seller: '#PNP-002 (Haryana Mill)',
      placedAt: '28 Aug, 09:30 PM',
    },
    {
      orderNumber: 'SP-ESCROW-910245',
      baleTitle: 'Double-Ply Mink Blankets (100kg)',
      godownHub: 'Sanoli Road Godown Hub',
      seller: '#PNP-001 (Gupta Syndicate)',
      placedAt: '29 Aug, 10:15 AM',
    },
  ]);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newZone, setNewZone] = useState('Sanoli Road Godown Hub');

  // Allocation State
  const [selectedOrderToAssign, setSelectedOrderToAssign] = useState<string | null>(null);
  const [selectedInspectorId, setSelectedInspectorId] = useState<string>('');

  const handleCreateInspector = (e: React.FormEvent) => {
    e.preventDefault();
    const nextCode = `#PNP-INSP-${String(inspectors.length + 1).padStart(2, '0')}`;
    const newAgent: InspectorFieldAgent = {
      id: `insp-${Date.now()}`,
      code: nextCode,
      name: newName,
      phone: newPhone,
      assignedZone: newZone,
      activeInspectionsCount: 0,
      completedInspectionsCount: 0,
      rating: 5.0,
      status: 'available',
      payoutPending: 0,
      joinedDate: 'Aug 2026',
    };

    setInspectors([...inspectors, newAgent]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
  };

  const handleAssignOrder = (orderNumber: string) => {
    if (!selectedInspectorId) return;

    setInspectors(prev => prev.map(insp => {
      if (insp.id === selectedInspectorId) {
        return {
          ...insp,
          activeInspectionsCount: insp.activeInspectionsCount + 1,
          status: 'on_ground',
        };
      }
      return insp;
    }));

    setUnassignedOrders(prev => prev.filter(o => o.orderNumber !== orderNumber));
    setSelectedOrderToAssign(null);
    setSelectedInspectorId('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Module Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Panipat On-Ground QC Inspectors Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage gig field coordinators for 30s live godown video recording, digital tare scale calibration, and dispatch sign-offs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Onboard Inspector</span>
          </button>
        </div>
      </div>

      {/* Unassigned Inspection Orders Alert Box */}
      {unassignedOrders.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-900">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Pending QC Allocations ({unassignedOrders.length} Orders Need Inspectors)</span>
            </div>
            <span className="text-[11px] text-amber-800 font-semibold">Priority: Escrow Locked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unassignedOrders.map((ord) => (
              <div
                key={ord.orderNumber}
                className="p-3.5 rounded-lg bg-white border border-amber-300 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                  <span>{ord.orderNumber}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{ord.placedAt}</span>
                </div>
                <div className="font-semibold text-slate-800">{ord.baleTitle}</div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{ord.godownHub} ({ord.seller})</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <select
                    value={selectedOrderToAssign === ord.orderNumber ? selectedInspectorId : ''}
                    onChange={(e) => {
                      setSelectedOrderToAssign(ord.orderNumber);
                      setSelectedInspectorId(e.target.value);
                    }}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800"
                  >
                    <option value="">Select Nearby Inspector...</option>
                    {inspectors.map((insp) => (
                      <option key={insp.id} value={insp.id}>
                        {insp.code} - {insp.name} ({insp.assignedZone})
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={selectedOrderToAssign !== ord.orderNumber || !selectedInspectorId}
                    onClick={() => handleAssignOrder(ord.orderNumber)}
                    className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-40 transition-colors shrink-0"
                  >
                    Assign →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Inspectors Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-slate-700" />
          <span>Active Panipat Field Roster</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {inspectors.map((insp) => (
            <div
              key={insp.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                    {insp.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    insp.status === 'on_ground'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    ● {insp.status === 'on_ground' ? 'On Ground Audit' : 'Available'}
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-sm">{insp.name}</div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{insp.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate" title={insp.assignedZone}>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{insp.assignedZone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Active Live</div>
                    <div className="font-bold text-slate-900">{insp.activeInspectionsCount} Lots</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Completed</div>
                    <div className="font-bold text-slate-900">{insp.completedInspectionsCount} Audits</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">Pending Payout</div>
                  <div className="font-bold text-slate-900">{formatINR(insp.payoutPending)}</div>
                </div>
                <a
                  href={`tel:${insp.phone}`}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Agent</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD INSPECTOR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Onboard Panipat Field QC Inspector
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateInspector} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohit Narwal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98123 45678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Panipat Hub Zone</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:border-slate-800 focus:outline-none"
                >
                  <option value="Sanoli Road Godown Hub">Sanoli Road Godown Hub</option>
                  <option value="Noorwala Industrial Area">Noorwala Industrial Area</option>
                  <option value="Barsat Road Sorting Yard">Barsat Road Sorting Yard</option>
                  <option value="G.T. Road Transport Hub">G.T. Road Transport Hub</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Create & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
