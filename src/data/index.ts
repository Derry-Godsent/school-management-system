// Mock data for the school management system

export const school = {
  name: 'Maple Grove International School',
  motto: 'Nurturing Excellence, Building Character',
  address: '14 Asanteman Road, Ayigya, Kumasi',
  phone: '+233 24 123 4567',
  phoneAlt: '+233 20 987 6543',
  email: 'info@maplegrove.edu.gh',
};

export const students = [
  {
    id: '1',
    name: 'Kwame Mensah',
    studentId: 'MG/2024/001',
    classId: 'jhs2',
    className: 'JHS 2',
    gender: 'Male',
    dob: '2012-03-15',
    guardianId: '1',
    house: 'Eagles',
    programme: 'Cambridge Enrichment',
    status: 'active',
  },
  {
    id: '2',
    name: 'Ama Serwaa',
    studentId: 'MG/2024/002',
    classId: 'jhs2',
    className: 'JHS 2',
    gender: 'Female',
    dob: '2012-07-22',
    guardianId: '1',
    house: 'Doves',
    programme: 'Ghanaian Core',
    status: 'active',
  },
  {
    id: '3',
    name: 'Kwame Mensah Jr.',
    studentId: 'MG/2024/003',
    classId: 'p5',
    className: 'Primary 5',
    gender: 'Male',
    dob: '2014-11-08',
    guardianId: '1',
    house: 'Lions',
    programme: 'Ghanaian Core',
    status: 'active',
  },
];

export const guardians = [
  {
    id: '1',
    name: 'Mr. & Mrs. Mensah',
    email: 'mensah.family@email.com',
    phone: '+233 24 555 6789',
    relation: 'Parent',
    studentIds: ['1', '2', '3'],
  },
];

export const demoUsers = [
  {
    id: 'parent-1',
    email: 'parent@demo.com',
    password: 'demo123',
    role: 'parent',
    guardianId: '1',
  },
];

export const results = [
  {
    id: 'res-001',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'math',
    subjectName: 'Mathematics',
    score: 82,
    position: 3,
    classAverage: 68,
    teacherComment: 'Excellent work. Consistent performance.',
  },
  {
    id: 'res-002',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'eng',
    subjectName: 'English Language',
    score: 75,
    position: 5,
    classAverage: 65,
    teacherComment: 'Good effort in comprehension. Needs to improve essay writing.',
  },
  {
    id: 'res-003',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'sci',
    subjectName: 'Science',
    score: 88,
    position: 1,
    classAverage: 62,
    teacherComment: 'Outstanding. A model student in practicals.',
  },
  {
    id: 'res-004',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'soc',
    subjectName: 'Social Studies',
    score: 71,
    position: 7,
    classAverage: 64,
    teacherComment: 'Good understanding. Participates well in class.',
  },
  {
    id: 'res-005',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'gh',
    subjectName: 'Ghanaian Language',
    score: 68,
    position: 8,
    classAverage: 66,
    teacherComment: 'Satisfactory. More reading recommended.',
  },
  {
    id: 'res-006',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'rme',
    subjectName: 'RME',
    score: 79,
    position: 4,
    classAverage: 70,
    teacherComment: 'Very good. Thoughtful responses.',
  },
  {
    id: 'res-007',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'ict',
    subjectName: 'ICT',
    score: 91,
    position: 1,
    classAverage: 60,
    teacherComment: 'Exceptional. Shows natural aptitude.',
  },
  {
    id: 'res-008',
    studentId: '1',
    term: 'term-1',
    year: '2025-2026',
    subjectId: 'fre',
    subjectName: 'French',
    score: 73,
    position: 6,
    classAverage: 63,
    teacherComment: 'Good progress. Pronunciation improving.',
  },
];

export const attendance = [
  { id: 'att-001', studentId: '1', date: '2026-02-02', status: 'present' },
  { id: 'att-002', studentId: '1', date: '2026-02-03', status: 'present' },
  { id: 'att-003', studentId: '1', date: '2026-02-04', status: 'present' },
  { id: 'att-004', studentId: '1', date: '2026-02-05', status: 'late' },
  { id: 'att-005', studentId: '1', date: '2026-02-06', status: 'present' },
  { id: 'att-006', studentId: '1', date: '2026-01-26', status: 'present' },
  { id: 'att-007', studentId: '1', date: '2026-01-27', status: 'present' },
  { id: 'att-008', studentId: '1', date: '2026-01-28', status: 'absent' },
  { id: 'att-009', studentId: '1', date: '2026-01-29', status: 'present' },
  { id: 'att-010', studentId: '1', date: '2026-01-30', status: 'present' },
];

export const feeRecords = [
  {
    id: 'fr-001',
    studentId: '1',
    term: 'term-2',
    year: '2025-2026',
    category: 'Tuition',
    charged: 3500,
    paid: 3500,
    balance: 0,
    status: 'paid',
  },
  {
    id: 'fr-002',
    studentId: '1',
    term: 'term-2',
    year: '2025-2026',
    category: 'Feeding',
    charged: 1200,
    paid: 1200,
    balance: 0,
    status: 'paid',
  },
  {
    id: 'fr-003',
    studentId: '1',
    term: 'term-2',
    year: '2025-2026',
    category: 'ICT',
    charged: 350,
    paid: 350,
    balance: 0,
    status: 'paid',
  },
  {
    id: 'fr-004',
    studentId: '1',
    term: 'term-2',
    year: '2025-2026',
    category: 'Examination',
    charged: 200,
    paid: 0,
    balance: 200,
    status: 'unpaid',
  },
  {
    id: 'fr-005',
    studentId: '1',
    term: 'term-2',
    year: '2025-2026',
    category: 'Sports',
    charged: 150,
    paid: 150,
    balance: 0,
    status: 'paid',
  },
];

export const paymentHistory = [
  {
    id: 'pay-001',
    studentId: '1',
    date: '2026-01-10',
    amount: 3500,
    category: 'Tuition',
    method: 'Mobile Money',
    reference: 'MOMO-2026-001',
    receivedBy: 'Daniel Asare',
  },
  {
    id: 'pay-002',
    studentId: '1',
    date: '2026-01-10',
    amount: 1200,
    category: 'Feeding',
    method: 'Mobile Money',
    reference: 'MOMO-2026-002',
    receivedBy: 'Daniel Asare',
  },
  {
    id: 'pay-003',
    studentId: '1',
    date: '2026-01-12',
    amount: 500,
    category: 'ICT',
    method: 'Bank Transfer',
    reference: 'BT-2026-001',
    receivedBy: 'Daniel Asare',
  },
];

export const timetable = [
  {
    day: 'Monday',
    periods: [
      { time: '7:30 - 8:15', subject: 'Mathematics', teacher: 'Mr. Kwesi Agyeman' },
      { time: '8:15 - 9:00', subject: 'English Language', teacher: 'Mrs. Maame Pokua' },
      { time: '9:15 - 10:00', subject: 'Science', teacher: 'Mr. Osei Bonsu' },
      { time: '10:15 - 11:00', subject: 'French', teacher: 'Mme. Adwoa Asante' },
      { time: '11:15 - 12:00', subject: 'ICT', teacher: 'Mr. Kofi Owusu' },
      { time: '12:00 - 12:45', subject: 'RME', teacher: 'Pastor James Mensah' },
    ],
  },
  {
    day: 'Tuesday',
    periods: [
      { time: '7:30 - 8:15', subject: 'Social Studies', teacher: 'Mrs. Efua Addo' },
      { time: '8:15 - 9:00', subject: 'Mathematics', teacher: 'Mr. Kwesi Agyeman' },
      { time: '9:15 - 10:00', subject: 'Ghanaian Language', teacher: 'Nana Yaa Serwaa' },
      { time: '10:15 - 11:00', subject: 'Science', teacher: 'Mr. Osei Bonsu' },
      { time: '11:15 - 12:00', subject: 'English Language', teacher: 'Mrs. Maame Pokua' },
      { time: '12:00 - 12:45', subject: 'Creative Arts', teacher: 'Mr. Adu Ampofo' },
    ],
  },
];

export const announcements = [
  {
    id: 'ann-1',
    title: 'Mid-Term Break Dates',
    date: '2026-02-14',
    audience: 'all',
    content: 'Mid-term break will be from February 17th to February 21st. School resumes on Monday, February 24th.',
  },
  {
    id: 'ann-2',
    title: 'Sports Day Preparations',
    date: '2026-02-10',
    audience: 'all',
    content: 'Annual Sports Day is scheduled for March 14th. Parents should ensure their children have complete sports kits.',
  },
  {
    id: 'ann-3',
    title: 'Fee Payment Reminder',
    date: '2026-02-01',
    audience: 'parents',
    content: 'Parents with outstanding fee balances are kindly requested to clear them before the mid-term break.',
  },
];

export const events = [
  {
    id: 'evt-1',
    title: 'PTA Meeting',
    date: '2026-02-15',
    time: '10:00 AM',
    location: 'School Hall',
    type: 'meeting',
  },
  {
    id: 'evt-2',
    title: 'Mid-Term Break',
    date: '2026-02-17',
    endDate: '2026-02-21',
    time: 'All Day',
    location: '',
    type: 'holiday',
  },
  {
    id: 'evt-3',
    title: 'Inter-House Sports Competition',
    date: '2026-03-07',
    time: '8:00 AM',
    location: 'Sports Field',
    type: 'sports',
  },
];

export const academicYear = {
  id: 'ay-2025-2026',
  name: '2025/2026',
  currentTerm: 'term-2',
  terms: [
    { id: 'term-1', name: 'First Term', start: '2025-09-08', end: '2025-12-19' },
    { id: 'term-2', name: 'Second Term', start: '2026-01-12', end: '2026-04-03' },
    { id: 'term-3', name: 'Third Term', start: '2026-04-27', end: '2026-07-31' },
  ],
};

export const gradingScale = [
  { min: 80, max: 100, grade: '1', remark: 'Excellent' },
  { min: 70, max: 79, grade: '2', remark: 'Very Good' },
  { min: 60, max: 69, grade: '3', remark: 'Good' },
  { min: 55, max: 59, grade: '4', remark: 'Credit' },
  { min: 50, max: 54, grade: '5', remark: 'Credit' },
  { min: 45, max: 49, grade: '6', remark: 'Credit' },
  { min: 40, max: 44, grade: '7', remark: 'Pass' },
  { min: 0, max: 39, grade: '8', remark: 'Fail' },
];

export function getGrade(score: number) {
  return gradingScale.find(g => score >= g.min && score <= g.max) || gradingScale[gradingScale.length - 1];
}

export function getStudentById(id: string) {
  return students.find(s => s.id === id);
}

export function getStudentResults(studentId: string) {
  return results.filter(r => r.studentId === studentId);
}

export function getStudentAttendance(studentId: string) {
  return attendance.filter(a => a.studentId === studentId);
}

export function getStudentFees(studentId: string) {
  return feeRecords.filter(f => f.studentId === studentId);
}

export function getStudentPayments(studentId: string) {
  return paymentHistory.filter(p => p.studentId === studentId);
}

export function getGuardianChildren(guardianId: string) {
  const guardian = guardians.find(g => g.id === guardianId);
  if (!guardian) return [];
  return students.filter(s => guardian.studentIds.includes(s.id));
}

export function getAttendanceStats(studentId: string) {
  const records = getStudentAttendance(studentId);
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const late = records.filter(r => r.status === 'late').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
  return { total, present, late, absent, percentage };
}

export function getFeeSummary(studentId: string) {
  const records = getStudentFees(studentId);
  const totalCharged = records.reduce((sum, r) => sum + r.charged, 0);
  const totalPaid = records.reduce((sum, r) => sum + r.paid, 0);
  const totalBalance = records.reduce((sum, r) => sum + r.balance, 0);
  return { totalCharged, totalPaid, totalBalance };
}

export function formatCurrency(amount: number): string {
  return `GHS ${amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const staff = [
  {
    id: 'admin-1',
    name: 'Mr. Kwame Asante',
    role: 'Super Admin',
    title: 'School Director',
    department: 'Administration',
    email: 'k.asante@maplegrove.edu.gh',
    phone: '+233 24 111 2233',
  },
];

export const classes = [
  { id: 'jhs2', name: 'JHS 2', department: 'jhs' },
  { id: 'p5', name: 'Primary 5', department: 'primary' },
];

export function getClassById(id: string) {
  return classes.find(c => c.id === id);
}

export const admissionApplications = [
  {
    id: 'app-001',
    childName: 'Adwoa Boateng',
    dob: '2018-06-15',
    applyingFor: 'KG 2',
    parentName: 'Mrs. Yaa Boateng',
    parentPhone: '+233 24 888 9900',
    parentEmail: 'y.boateng@email.com',
    status: 'pending',
    date: '2026-01-28',
    notes: '',
  },
  {
    id: 'app-002',
    childName: 'Kwame Asare',
    dob: '2016-03-22',
    applyingFor: 'Primary 4',
    parentName: 'Mr. & Mrs. Asare',
    parentPhone: '+233 20 777 6655',
    parentEmail: 'asare.family@email.com',
    status: 'pending',
    date: '2026-01-30',
    notes: '',
  },
];

// ---------------------------------------------------------------------------
// PUBLIC SITE CONTENT
// ---------------------------------------------------------------------------

export const departments = [
  {
    id: 'early-years',
    name: 'Early Years (KG 1 - KG 2)',
    levels: ['KG 1', 'KG 2'],
  },
  {
    id: 'primary',
    name: 'Primary School (Primary 1 - Primary 6)',
    levels: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
  },
  {
    id: 'jhs',
    name: 'Junior High School (JHS 1 - JHS 3)',
    levels: ['JHS 1', 'JHS 2', 'JHS 3'],
  },
];

export const galleryAlbums = [
  { id: 'cultural-festival', title: 'Cultural Festival', imageCount: 48, date: '2026-03-14' },
  { id: 'science-exhibition', title: 'Science & Maths Exhibition', imageCount: 36, date: '2026-02-21' },
  { id: 'sports-day', title: 'Inter-House Sports Day', imageCount: 52, date: '2026-02-07' },
  { id: 'reading-week', title: 'Reading Week', imageCount: 24, date: '2025-11-18' },
  { id: 'graduation-2025', title: 'JHS Graduation 2025', imageCount: 64, date: '2025-07-26' },
];

export const news = [
  {
    id: 'news-001',
    category: 'Academics',
    date: '2026-09-28',
    title: 'Maple Grove records 100% pass rate in the 2026 BECE',
    excerpt: 'All 68 candidates passed, with 12 earning places at top senior high schools.',
    content:
      'All 68 candidates presented for the Basic Education Certificate Examination passed, with 41 achieving aggregate 20 or better. Twelve students earned placements at senior high schools including Prempeh College, Yaa Asantewaa Girls and Opoku Ware School.',
  },
  {
    id: 'news-002',
    category: 'Admissions',
    date: '2026-09-15',
    title: '2026/2027 admissions now open for all year groups',
    excerpt: 'Apply online or collect a form from the admissions office. Early applications encouraged.',
    content:
      'Applications are open for KG 1 through JHS 2. Parents may apply online through the school website or collect a form from the admissions office. Early applications are encouraged as places in Primary and JHS fill quickly.',
  },
  {
    id: 'news-003',
    category: 'Events',
    date: '2026-08-30',
    title: 'Science & Maths Exhibition showcases 40 student projects',
    excerpt: 'Three projects were selected for the regional STEM fair in Kumasi.',
    content:
      'Students from Primary 4 to JHS 3 presented projects ranging from solar-powered irrigation models to a locally built water filtration system. Three projects were selected to represent the school at the regional STEM fair in Kumasi.',
  },
  {
    id: 'news-004',
    category: 'Facilities',
    date: '2026-08-12',
    title: 'New ICT laboratory opens with 30 workstations',
    excerpt: 'Thirty workstations with power backup and broadband for Primary 4 upwards.',
    content:
      'Our refurbished ICT laboratory now provides 30 workstations with reliable power backup and broadband access. Every student from Primary 4 upwards receives a timetabled ICT lesson each week as part of the curriculum.',
  },
  {
    id: 'news-005',
    category: 'Sports',
    date: '2026-07-19',
    title: 'Eagles House wins Inter-House Sports for the third year running',
    excerpt: 'Eagles retained the trophy with strong athletics and football performances.',
    content:
      'Eagles House retained the inter-house trophy with a strong showing in athletics and football. The day closed with a march past and a display by our cultural troupe, with parents and alumni in attendance.',
  },
  {
    id: 'news-006',
    category: 'Notices',
    date: '2026-06-25',
    title: 'Second term reopening and fee payment reminder',
    excerpt: 'School reopens 8 September 2026. Please settle outstanding fees before reopening.',
    content:
      'School reopens on 8 September 2026. Parents are kindly reminded to settle outstanding fees before reopening to allow smooth registration. Fee statements are available in the Parent Portal under the Fees section.',
  },
];
