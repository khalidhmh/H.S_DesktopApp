import { useState } from 'react';
import { Plus, Filter, Search, Droplet, Zap, Flame, Wifi, Wind, Wrench, MessageSquare, MoreVertical } from 'lucide-react';
import { AddFaultModal } from '@/app/components/AddFaultModal';

type FaultStatus = 'pending' | 'in-progress' | 'completed';

type FaultType = 'plumbing' | 'electric' | 'gas' | 'internet' | 'ac' | 'other';

interface Fault {
  id: string;
  type: FaultType;
  title: string;
  description: string;
  location: {
    floor: number;
    wing: string;
    roomType: string;
    roomNumber?: string;
  };
  status: FaultStatus;
  reportedBy: string;
  reportedDate: string;
  photoUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

const faultTypeIcons: Record<FaultType, { icon: JSX.Element; color: string; label: string }> = {
  plumbing: { icon: <Droplet size={20} />, color: 'text-blue-600', label: 'سباكة' },
  electric: { icon: <Zap size={20} />, color: 'text-yellow-600', label: 'كهرباء' },
  gas: { icon: <Flame size={20} />, color: 'text-red-600', label: 'غاز' },
  internet: { icon: <Wifi size={20} />, color: 'text-purple-600', label: 'إنترنت' },
  ac: { icon: <Wind size={20} />, color: 'text-cyan-600', label: 'تكييف' },
  other: { icon: <Wrench size={20} />, color: 'text-gray-600', label: 'أخرى' },
};

// Mock data
const mockFaults: Fault[] = [
  {
    id: '1',
    type: 'plumbing',
    title: 'تسرب مياه في الحمام',
    description: 'يوجد تسرب مياه من أنبوب المغسلة في الحمام الرئيسي',
    location: { floor: 3, wing: 'B', roomType: 'غرفة', roomNumber: '301' },
    status: 'pending',
    reportedBy: 'أحمد محمد',
    reportedDate: '2025-01-29',
    photoUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
    priority: 'high',
  },
  {
    id: '2',
    type: 'electric',
    title: 'عطل في الإضاءة',
    description: 'الأضواء في الممر لا تعمل منذ يومين',
    location: { floor: 2, wing: 'A', roomType: 'ممر' },
    status: 'in-progress',
    reportedBy: 'خالد علي',
    reportedDate: '2025-01-28',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'gas',
    title: 'رائحة غاز في المطبخ',
    description: 'رائحة غاز خفيفة في منطقة المطبخ المشترك',
    location: { floor: 1, wing: 'D', roomType: 'مطبخ مشترك' },
    status: 'pending',
    reportedBy: 'محمد سعد',
    reportedDate: '2025-01-30',
    priority: 'high',
  },
  {
    id: '4',
    type: 'internet',
    title: 'انقطاع الإنترنت',
    description: 'الإنترنت لا يعمل في غرفة الدراسة الرئيسية',
    location: { floor: 2, wing: 'C', roomType: 'غرفة دراسة' },
    status: 'in-progress',
    reportedBy: 'عمر حسن',
    reportedDate: '2025-01-29',
    priority: 'medium',
  },
  {
    id: '5',
    type: 'ac',
    title: 'التكييف لا يبرد',
    description: 'جهاز التكييف يعمل لكن لا يخرج هواء بارد',
    location: { floor: 4, wing: 'A', roomType: 'غرفة', roomNumber: '405' },
    status: 'completed',
    reportedBy: 'سعد الدين',
    reportedDate: '2025-01-27',
    priority: 'low',
  },
  {
    id: '6',
    type: 'plumbing',
    title: 'انسداد في المصرف',
    description: 'المصرف في الحمام المشترك مسدود',
    location: { floor: 3, wing: 'C', roomType: 'حمام مشترك' },
    status: 'completed',
    reportedBy: 'يوسف عبدالله',
    reportedDate: '2025-01-26',
    priority: 'medium',
  },
];

export function MaintenancePage() {
  const [faults, setFaults] = useState<Fault[]>(mockFaults);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FaultType | 'all'>('all');

  const filteredFaults = faults.filter((fault) => {
    const matchesSearch =
      fault.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fault.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || fault.type === filterType;
    return matchesSearch && matchesType;
  });

  const pendingFaults = filteredFaults.filter((f) => f.status === 'pending');
  const inProgressFaults = filteredFaults.filter((f) => f.status === 'in-progress');
  const completedFaults = filteredFaults.filter((f) => f.status === 'completed');

  const handleStatusChange = (faultId: string, newStatus: FaultStatus) => {
    setFaults((prev) =>
      prev.map((fault) =>
        fault.id === faultId ? { ...fault, status: newStatus } : fault
      )
    );
  };

  const handleAddFault = (newFault: Omit<Fault, 'id' | 'reportedDate' | 'reportedBy'>) => {
    const fault: Fault = {
      ...newFault,
      id: Date.now().toString(),
      reportedBy: 'المستخدم الحالي',
      reportedDate: new Date().toISOString().split('T')[0],
    };
    setFaults((prev) => [fault, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#002147] mb-1">
              إدارة الصيانة والأعطال
            </h1>
            <p className="text-gray-600 text-sm">
              متابعة وإدارة طلبات الصيانة والأعطال
            </p>
          </div>

          {/* Add Fault Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#F2C94C] hover:bg-[#e0b73d] text-[#002147] px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>إضافة عطل جديد</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث عن عطل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#F2C94C] transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-[#002147] shadow-sm'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              الكل
            </button>
            {Object.entries(faultTypeIcons).map(([type, { icon, color, label }]) => (
              <button
                key={type}
                onClick={() => setFilterType(type as FaultType)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filterType === type
                    ? 'bg-white text-[#002147] shadow-sm'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <span className={color}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pending Column */}
        <KanbanColumn
          title="قيد الانتظار"
          count={pendingFaults.length}
          color="yellow"
          faults={pendingFaults}
          onStatusChange={handleStatusChange}
        />

        {/* In Progress Column */}
        <KanbanColumn
          title="قيد المعالجة"
          count={inProgressFaults.length}
          color="blue"
          faults={inProgressFaults}
          onStatusChange={handleStatusChange}
        />

        {/* Completed Column */}
        <KanbanColumn
          title="مكتمل"
          count={completedFaults.length}
          color="green"
          faults={completedFaults}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Add Fault Modal */}
      {isAddModalOpen && (
        <AddFaultModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddFault}
        />
      )}
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  count: number;
  color: 'yellow' | 'blue' | 'green';
  faults: Fault[];
  onStatusChange: (faultId: string, newStatus: FaultStatus) => void;
}

function KanbanColumn({ title, count, color, faults, onStatusChange }: KanbanColumnProps) {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
  };

  const headerColors = {
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <div className={`rounded-2xl border-2 ${colorClasses[color]} overflow-hidden`}>
      {/* Column Header */}
      <div className={`${headerColors[color]} text-white p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
            {count}
          </span>
        </div>
      </div>

      {/* Faults List */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
        {faults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">لا توجد أعطال</p>
          </div>
        ) : (
          faults.map((fault) => (
            <FaultCard key={fault.id} fault={fault} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}

interface FaultCardProps {
  fault: Fault;
  onStatusChange: (faultId: string, newStatus: FaultStatus) => void;
}

function FaultCard({ fault, onStatusChange }: FaultCardProps) {
  const [showActions, setShowActions] = useState(false);
  const faultIcon = faultTypeIcons[fault.type];

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  const priorityLabels = {
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
      {/* Photo Thumbnail */}
      {fault.photoUrl && (
        <div className="h-32 bg-gray-200 overflow-hidden">
          <img
            src={fault.photoUrl}
            alt={fault.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header with Type Icon and Priority */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`${faultIcon.color} bg-gray-50 p-2 rounded-lg`}>
              {faultIcon.icon}
            </div>
            <div>
              <h4 className="font-bold text-[#002147] text-sm">{fault.title}</h4>
              <p className={`text-xs px-2 py-0.5 rounded border inline-block mt-1 ${priorityColors[fault.priority]}`}>
                {priorityLabels[fault.priority]}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {fault.description}
        </p>

        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">الموقع</p>
          <p className="text-sm font-medium text-[#002147]">
            الطابق {fault.location.floor} - جناح {fault.location.wing} - {fault.location.roomType}
            {fault.location.roomNumber && ` ${fault.location.roomNumber}`}
          </p>
        </div>

        {/* Reporter and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>بواسطة: {fault.reportedBy}</span>
          <span>{fault.reportedDate}</span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button className="flex-1 bg-[#002147] hover:bg-[#003366] text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
            <MessageSquare size={16} />
            <span>رد</span>
          </button>
          <div className="relative flex-1">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              تغيير الحالة
            </button>
            {showActions && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                <button
                  onClick={() => {
                    onStatusChange(fault.id, 'pending');
                    setShowActions(false);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-yellow-50 text-sm transition-colors"
                >
                  قيد الانتظار
                </button>
                <button
                  onClick={() => {
                    onStatusChange(fault.id, 'in-progress');
                    setShowActions(false);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-blue-50 text-sm transition-colors"
                >
                  قيد المعالجة
                </button>
                <button
                  onClick={() => {
                    onStatusChange(fault.id, 'completed');
                    setShowActions(false);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-green-50 text-sm transition-colors"
                >
                  مكتمل
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
