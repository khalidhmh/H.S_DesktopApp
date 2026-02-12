export type StudentStatus = 'credit' | 'regular' | 'expat'

export interface Student {
  id: string
  name: string
  photo: string
  college: string
  year: number
  roomNumber: string
  floor: number
  governorate: string
  status: StudentStatus
  nationalId: string
  phone: string
  email: string
  guardianName: string
  guardianPhone: string
  guardianRelation: string
  absenceCount: number
  penaltyCount: number
  // Booleans for UI flags
  hasPenalties: boolean
  exceededAbsence: boolean
  // Extra fields for details
  activities?: { type: 'sports' | 'cultural' | 'social'; name: string; date: string }[]
  attendanceHistory?: { date: string; status: 'present' | 'absent' | 'pending' }[]
  penaltiesHistory?: {
    id: string
    title: string
    date: string
    status: 'active' | 'resolved'
    description: string
  }[]
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    college: 'الهندسة',
    year: 3,
    roomNumber: '301',
    floor: 3,
    governorate: 'القاهرة',
    status: 'regular',
    nationalId: '30012345678901',
    phone: '01012345678',
    email: 'ahmed.eng@univ.edu',
    guardianName: 'محمد علي',
    guardianPhone: '01000000001',
    guardianRelation: 'والد',
    absenceCount: 2,
    penaltyCount: 0,
    hasPenalties: false,
    exceededAbsence: false,
    activities: [{ type: 'sports', name: 'دوري كرة القدم بالجامعة', date: '2023-11-15' }],
    attendanceHistory: [
      { date: '2023-10-01', status: 'present' },
      { date: '2023-10-02', status: 'present' },
      { date: '2023-10-03', status: 'absent' },
      { date: '2023-10-04', status: 'present' }
    ],
    penaltiesHistory: []
  },
  {
    id: '2',
    name: 'سيف الدين كريم',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    college: 'الطب البشري',
    year: 5,
    roomNumber: '502',
    floor: 5,
    governorate: 'المنوفية',
    status: 'credit',
    nationalId: '3010000000000',
    phone: '01200000002',
    email: 'seif.med@univ.edu',
    guardianName: 'كريم محمود',
    guardianPhone: '01200000003',
    guardianRelation: 'والد',
    absenceCount: 8,
    penaltyCount: 2,
    hasPenalties: true,
    exceededAbsence: true,
    activities: [],
    attendanceHistory: [
      { date: '2023-10-01', status: 'present' },
      { date: '2023-10-02', status: 'absent' },
      { date: '2023-10-03', status: 'absent' }
    ],
    penaltiesHistory: [
      {
        id: 'p1',
        title: 'إزعاج',
        date: '2023-11-20',
        status: 'active',
        description: 'صوت مرتفع بعد 11 مساءً'
      }
    ]
  },
  {
    id: '3',
    name: 'عبدالرحمن يوسف',
    photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
    college: 'حاسبات ومعلومات',
    year: 2,
    roomNumber: '205',
    floor: 2,
    governorate: 'الشرقية',
    status: 'expat',
    nationalId: '3020000000000',
    phone: '01100000004',
    email: 'abdo.cs@univ.edu',
    guardianName: 'يوسف أحمد',
    guardianPhone: '01100000005',
    guardianRelation: 'والد',
    absenceCount: 0,
    penaltyCount: 0,
    hasPenalties: false,
    exceededAbsence: false,
    activities: [{ type: 'cultural', name: 'ورشة النادي العلمي', date: '2023-12-05' }],
    attendanceHistory: [],
    penaltiesHistory: []
  }
]
