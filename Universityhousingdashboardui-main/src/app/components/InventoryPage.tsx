import { useState } from 'react';
import { 
  Package, 
  Home, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  ClipboardList,
  Database,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minLevel: number;
  category: string;
}

interface RoomItem {
  id: string;
  name: string;
  count: number;
  status: 'good' | 'damaged' | 'missing';
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'مراتب طبية', quantity: 150, minLevel: 20, category: 'أثاث' },
  { id: '2', name: 'كراسي مكتب', quantity: 85, minLevel: 10, category: 'أثاث' },
  { id: '3', name: 'لمبات LED', quantity: 320, minLevel: 50, category: 'كهرباء' },
  { id: '4', name: 'وسائد نوم', quantity: 200, minLevel: 30, category: 'مفروشات' },
  { id: '5', name: 'مراوح سقف', quantity: 12, minLevel: 5, category: 'أجهزة' },
  { id: '6', name: 'بطانيات شتوية', quantity: 45, minLevel: 15, category: 'مفروشات' },
];

const mockRoomCustody: Record<string, RoomItem[]> = {
  '305': [
    { id: '1', name: 'أسرة مفردة', count: 3, status: 'good' },
    { id: '2', name: 'مكاتب دراسة', count: 3, status: 'good' },
    { id: '3', name: 'مرآة حائط', count: 1, status: 'damaged' },
    { id: '4', name: 'خزائن ملابس', count: 3, status: 'good' },
  ],
  '204': [
    { id: '1', name: 'أسرة مفردة', count: 2, status: 'good' },
    { id: '2', name: 'مكاتب دراسة', count: 2, status: 'missing' },
    { id: '3', name: 'سجادة', count: 1, status: 'good' },
  ]
};

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'stores' | 'rooms'>('stores');
  const [roomSearch, setRoomSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  return (
    <div className="p-6 bg-[#F5F7FA] h-full overflow-y-auto" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#002147]">
              <Database size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400">إجمالي العناصر بالمخازن</p>
              <h3 className="text-2xl font-black text-[#002147]">812 قطعة</h3>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <Home size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400">عناصر في عهدة الغرف</p>
              <h3 className="text-2xl font-black text-[#002147]">2,450 قطعة</h3>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400">عناصر تالفة / مفقودة</p>
              <h3 className="text-2xl font-black text-[#002147]">18 قطعة</h3>
            </div>
          </motion.div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex border-b border-gray-100 p-2">
            <button 
              onClick={() => setActiveTab('stores')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${activeTab === 'stores' ? 'bg-[#002147] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Package size={20} />
              مخازن الأدوار (المستودع الرئيسي)
            </button>
            <button 
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${activeTab === 'rooms' ? 'bg-[#002147] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <ClipboardList size={20} />
              عهدة الغرف
            </button>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            {activeTab === 'stores' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="relative w-80">
                    <input 
                      type="text" 
                      placeholder="بحث في المخزن..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:ring-2 focus:ring-[#F2C94C] outline-none"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                    />
                    <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-100 transition-all">
                      <AlertTriangle size={18} />
                      تبليغ عن تلف
                    </button>
                    <button className="bg-[#F2C94C] text-[#002147] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#e0b83b] transition-all">
                      <Plus size={18} />
                      إضافة مخزون
                    </button>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">اسم الصنف</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">التصنيف</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">الكمية المتوفرة</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">حد التنبيه</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {mockInventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-[#002147]">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                          <td className="px-6 py-4 font-black text-[#002147]">{item.quantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.minLevel}</td>
                          <td className="px-6 py-4">
                            {item.quantity <= item.minLevel ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                مخزون منخفض
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                                متوفر
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-md mb-8">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="ادخل رقم الغرفة (مثال: 305)..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-lg font-bold pr-14 focus:ring-4 focus:ring-[#F2C94C]/20 outline-none text-center"
                      value={roomSearch}
                      onChange={(e) => setRoomSearch(e.target.value)}
                    />
                    <Search className="absolute right-5 top-5 text-gray-400" size={24} />
                  </div>
                </div>

                {mockRoomCustody[roomSearch] ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl bg-gray-50 rounded-3xl p-8 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-[#002147]">قائمة عهدة الغرفة رقم {roomSearch}</h3>
                      <span className="bg-[#002147] text-white px-3 py-1 rounded-lg text-xs font-bold">4 طالب مسجل</span>
                    </div>

                    <div className="space-y-3">
                      {mockRoomCustody[roomSearch].map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              item.status === 'good' ? 'bg-green-50 text-green-600' : 
                              item.status === 'damaged' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {item.status === 'good' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                            </div>
                            <div>
                              <p className="font-bold text-[#002147]">{item.name}</p>
                              <p className="text-xs text-gray-400">العدد: {item.count}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {item.status === 'good' && (
                              <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                                حالة جيدة
                                <CheckCircle2 size={16} />
                              </span>
                            )}
                            {item.status === 'damaged' && (
                              <span className="text-sm font-bold text-orange-600 flex items-center gap-1">
                                يوجد تلف
                                <AlertTriangle size={16} />
                              </span>
                            )}
                            {item.status === 'missing' && (
                              <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                                مفقود
                                <XCircle size={16} />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                      <button className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">تحميل كتقرير</button>
                      <button className="bg-[#002147] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#003366] transition-all shadow-md">اعتماد الجرد الدوري</button>
                    </div>
                  </motion.div>
                ) : roomSearch ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">لا توجد بيانات لهذه الغرفة حالياً</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                    <ClipboardList size={48} className="mb-4 opacity-20" />
                    <p className="font-bold text-center">قم بالبحث برقم الغرفة لاستعراض قائمة العهدة الخاصة بها<br/>والتأكد من سلامة المرفقات</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
