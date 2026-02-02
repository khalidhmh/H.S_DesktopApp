import { useState } from 'react';
import { 
  MessageSquare, 
  Lock, 
  Search, 
  Paperclip, 
  Send, 
  CheckCircle, 
  Clock, 
  User,
  MoreVertical,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface Complaint {
  id: string;
  studentName: string;
  roomNo: string;
  topic: string;
  summary: string;
  timeReceived: string;
  status: 'new' | 'read' | 'replied';
  isAnonymous: boolean;
  message: string;
  attachments?: string[];
}

const mockComplaints: Complaint[] = [
  {
    id: '1',
    studentName: 'أحمد محمود',
    roomNo: 'A-204',
    topic: 'مشكلة في تكييف الغرفة',
    summary: 'التكييف يصدر صوتاً عالياً ولا يبرد بشكل جيد منذ يومين.',
    timeReceived: '10:30 ص',
    status: 'new',
    isAnonymous: false,
    message: 'السلام عليكم، أود الإبلاغ عن عطل في جهاز التكييف الخاص بغرفتي رقم A-204. الجهاز يصدر ضوضاء مزعجة جداً ولا يقوم بالتبريد الكافي، مما يجعل الدراسة في الغرفة صعبة جداً خصوصاً في فترة الظهيرة. أرجو ��رسال فني في أقرب وقت ممكن.',
    attachments: ['https://images.unsplash.com/photo-1590483734724-38fa19744980?w=300&h=200&fit=crop']
  },
  {
    id: '2',
    studentName: 'مجهول',
    roomNo: 'غير محدد',
    topic: 'شكوى بخصوص النظافة العامة',
    summary: 'هناك تراكم للمخلفات في الطابق الثالث بالقرب من المصعد.',
    timeReceived: '09:15 ص',
    status: 'read',
    isAnonymous: true,
    message: 'هناك إهمال واضح في نظافة الطابق الثالث، القمامة متراكمة منذ الصباح الباكر ولم يتم إزالتها حتى الآن. الرائحة بدأت تصبح مزعجة جداً وتؤثر على المظهر العام والمستوى الصحي للسكن.',
  },
  {
    id: '3',
    studentName: 'سارة خالد',
    roomNo: 'B-105',
    topic: 'طلب تمديد فترة دخول المكتبة',
    summary: 'نرجو تمديد ساعات العمل في المكتبة خلال فترة الامتحانات.',
    timeReceived: 'أمس',
    status: 'replied',
    isAnonymous: false,
    message: 'نحن طالبات الطابق الأول نطلب تمديد ساعات العمل في المكتبة المركزية لتصبح حتى الساعة 12 منتصف الليل بدلاً من 10 مساءً، وذلك نظر��ً لاقتراب موعد الامتحانات النهائية وحاجتنا لمكان هادئ للمذاكرة.',
  },
  {
    id: '4',
    studentName: 'محمد علي',
    roomNo: 'C-302',
    topic: 'عطل في مفتاح الكهرباء',
    summary: 'أحد مفاتيح الإنارة في الغرفة لا يعمل ويصدر شرارة.',
    timeReceived: 'منذ يومين',
    status: 'new',
    isAnonymous: false,
    message: 'أرجو الانتباه، مفتاح الإضاءة الرئيسي في الغرفة C-302 متعطل، وعند الضغط عليه يصدر شرارة كهربائية بسيطة، نخشى من حدوث تماس كهربائي. يرجى الإصلاح العاجل.',
  },
  {
    id: '5',
    studentName: 'مجهول',
    roomNo: 'غير محدد',
    topic: 'ملاحظة على جودة الطعام',
    summary: 'الوجبة المقدمة اليوم في الغداء كانت باردة وغير ناضجة تماماً.',
    timeReceived: 'منذ 3 أيام',
    status: 'read',
    isAnonymous: true,
    message: 'الوجبة المقدمة اليوم (الأرز والدجاج) كانت باردة جداً، والدجاج لم يكن ناضجاً بشكل كامل. نرجو الاهتمام بجودة الطعام المقدم في المطعم الجامعي.',
  }
];

export function ComplaintsPage() {
  const [selectedId, setSelectedId] = useState<string>(mockComplaints[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  const selectedComplaint = mockComplaints.find(c => c.id === selectedId) || mockComplaints[0];

  const filteredComplaints = mockComplaints.filter(c => 
    c.topic.includes(searchQuery) || 
    c.studentName.includes(searchQuery) ||
    c.roomNo.includes(searchQuery)
  );

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'new': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">جديد</span>;
      case 'read': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">تم الاطلاع</span>;
      case 'replied': return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600">تم الرد</span>;
    }
  };

  return (
    <div className="h-full flex bg-[#F5F7FA]">
      {/* Right Panel: List (Using flex-row-reverse for RTL layout where list is on the right) */}
      <div className="w-96 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#002147] mb-4">قائمة الشكاوى</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="بحث في الشكاوى..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm pr-10 focus:ring-2 focus:ring-[#F2C94C] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredComplaints.map((complaint) => (
            <button
              key={complaint.id}
              onClick={() => setSelectedId(complaint.id)}
              className={`w-full text-right p-4 border-b border-gray-50 transition-all ${
                selectedId === complaint.id ? 'bg-[#F2C94C]/10 border-r-4 border-r-[#F2C94C]' : 'hover:bg-gray-50'
              } ${complaint.isAnonymous ? 'bg-purple-50/50' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#002147] text-sm">
                    {complaint.isAnonymous ? 'شكوى مجهولة' : complaint.studentName}
                  </span>
                  {complaint.isAnonymous && <Lock size={12} className="text-purple-500" />}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{complaint.timeReceived}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-medium">{complaint.roomNo}</span>
                <span className="text-gray-300">•</span>
                <p className="text-xs font-bold text-[#002147] truncate flex-1">{complaint.topic}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400 truncate max-w-[180px]">{complaint.summary}</p>
                {getStatusBadge(complaint.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Left Panel: Details */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedComplaint.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Detail Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedComplaint.isAnonymous ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {selectedComplaint.isAnonymous ? <Lock size={24} /> : <User size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#002147]">
                    {selectedComplaint.isAnonymous ? 'صاحب الشكوى مجهول' : selectedComplaint.studentName}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="font-medium">الموضوع: {selectedComplaint.topic}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {selectedComplaint.timeReceived}
                    </span>
                    {!selectedComplaint.isAnonymous && (
                      <>
                        <span>•</span>
                        <span>الغرفة: {selectedComplaint.roomNo}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Detail Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-gray-700 leading-relaxed">
                  {selectedComplaint.message}
                </div>

                {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-gray-500">المرفقات ({selectedComplaint.attachments.length})</p>
                    <div className="flex gap-3">
                      {selectedComplaint.attachments.map((url, idx) => (
                        <div key={idx} className="relative group cursor-pointer">
                          <ImageWithFallback 
                            src={url} 
                            className="w-48 h-32 rounded-2xl object-cover border border-gray-200" 
                            alt="Attachment"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <Search size={24} className="text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Area */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center group-hover:border-[#F2C94C] transition-all">
                        <CheckCircle size={14} className="text-white group-hover:text-gray-200" />
                      </div>
                      <span className="text-sm font-bold text-gray-600">تحديد كمحلولة</span>
                    </label>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                    <Paperclip size={14} />
                    إرفاق ملف
                  </button>
                </div>
                
                <div className="relative">
                  <textarea 
                    placeholder="اكتب ردك هنا..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#F2C94C] outline-none min-h-[100px] resize-none pr-4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button className="absolute bottom-4 left-4 bg-[#002147] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#003366] transition-all shadow-sm">
                    إرسال الرد
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
