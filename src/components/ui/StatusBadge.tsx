import React from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle2, Clock, Plane, MapPin } from 'lucide-react';
import { CheckpointType } from '@/repositories/statusRepo';

export interface StatusBadgeProps {
  checkpoint: CheckpointType | string;
  size?: 'normal' | 'large';
  className?: string;
}

export const CHECKPOINT_LABELS: Record<string, { label: string; desc: string; icon: any; colorClass: string }> = {
  check_in: {
    label: 'Check-in Bandara',
    desc: 'Bagasi sudah diserahkan di konter check-in',
    icon: Clock,
    colorClass: 'bg-amber-50 text-amber-900 border-2 border-amber-300',
  },
  lewat_imigrasi: {
    label: 'Sudah Lewat Imigrasi',
    desc: 'Pemeriksaan paspor & keamanan selesai',
    icon: CheckCircle2,
    colorClass: 'bg-green-50 text-green-900 border-2 border-green-400',
  },
  ruang_tunggu: {
    label: 'Di Ruang Tunggu Gate',
    desc: 'Sedang menunggu panggilan naik pesawat',
    icon: MapPin,
    colorClass: 'bg-blue-50 text-blue-900 border-2 border-blue-400',
  },
  naik_pesawat: {
    label: 'Sudah Naik Pesawat (Boarding)',
    desc: 'Sudah berada di dalam kabin pesawat',
    icon: Plane,
    colorClass: 'bg-emerald-50 text-emerald-900 border-2 border-emerald-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  checkpoint,
  size = 'normal',
  className,
}) => {
  const info = CHECKPOINT_LABELS[checkpoint] || {
    label: checkpoint,
    desc: '',
    icon: Clock,
    colorClass: 'bg-slate-100 text-slate-800 border-2 border-slate-300',
  };

  const Icon = info.icon;

  if (size === 'large') {
    return (
      <div
        className={cn(
          'flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-bold shadow-xs',
          info.colorClass,
          className
        )}
      >
        <Icon className="w-7 h-7 shrink-0 stroke-[2.5]" />
        <div>
          <div className="text-xl font-bold tracking-tight">{info.label}</div>
          {info.desc && <div className="text-base font-normal text-slate-700 mt-0.5">{info.desc}</div>}
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold shadow-xs',
        info.colorClass,
        className
      )}
    >
      <Icon className="w-5 h-5 shrink-0 stroke-[2.5]" />
      <span>{info.label}</span>
    </span>
  );
};
