// ============================================================================
// SCHOOL DIGITAL ECOSYSTEM - DEMO DATA LAYER
// Fictional demonstration school: Maple Grove International School, Kumasi
// All data is clearly fictional and for demonstration purposes only.
// ============================================================================

export const TENANT_ID = 'maple-grove-demo';

// ---------------------------------------------------------------------------
// SCHOOL CONFIGURATION
// ---------------------------------------------------------------------------
export const school = {
  id: TENANT_ID,
  name: 'Maple Grove International School',
  shortName: 'Maple Grove',
  motto: 'Nurturing Excellence, Building Character',
  tagline: 'A blended Ghanaian and Cambridge curriculum for the modern learner.',
  address: '14 Asanteman Road, Ayigya, Kumasi',
  city: 'Kumasi',
  region: 'Ashanti Region',
  country: 'Ghana',
  phone: '+233 32 204 5678',
  phoneAlt: '+233 24 567 8901',
  email: 'info@maplegrove.edu.gh',
  website: 'www.maplegrove.edu.gh',
  established: 2008,
  logo: 'MG',
  colours: {
    primary: '#E85D04',
    secondary: '#1a1a1a',
    accent: '#FFF7ED',
  },
  socialMedia: {
    facebook: 'maplegroveinternational',
    instagram: 'maplegrove_gh',
    twitter: 'maplegrove_gh',
  },
};

// ---------------------------------------------------------------------------
// ACADEMIC STRUCTURE
// ---------------------------------------------------------------------------
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

export const departments = [
  { id: 'early-years', name: 'Early Years', levels: ['KG 1', 'KG 2'] },
  { id: 'primary', name: 'Primary', levels: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'] },
  { id: 'jhs', name: 'Junior High School', levels: ['JHS 1', 'JHS 2', 'JHS 3'] },
];

export const classes = [
  { id: 'kg1', name: 'KG 1', department: 'early-years', teacher: 'teacher-1', students: 18 },
  { id: 'kg2', name: 'KG 2', department: 'early-years', teacher: 'teacher-2', students: 20 },
  { id: 'p1', name: 'Primary 1', department: 'primary', teacher: 'teacher-3', students: 22 },
  { id: 'p2', name: 'Primary 2', department: 'primary', teacher: 'teacher-4', students: 21 },
  { id: 'p3', name: 'Primary 3', department: 'primary', teacher: 'teacher-5', students: 24 },
  { id: 'p4', name: 'Primary 4', department: 'primary', teacher: 'teacher-6', students: 23 },
  { id: 'p5', name: 'Primary 5', department: 'primary', teacher: 'teacher-7', students: 25 },
  { id: 'p6', name: 'Primary 6', department: 'primary', teacher: 'teacher-8', students: 22 },
  { id: 'jhs1', name: 'JHS 1', department: 'jhs', teacher: 'teacher-9', students: 28 },
  { id: 'jhs2', name: 'JHS 2', department: 'jhs', teacher: 'teacher-10', students: 26 },
  { id: 'jhs3', name: 'JHS 3', department: 'jhs', teacher: 'teacher-11', students: 24 },
];

// ---------------------------------------------------------------------------
// GRADING SYSTEM
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// STAFF
// ---------------------------------------------------------------------------
export const staff = [
  { id: 'admin-1', name: 'Mr. Kwame Asante', role: 'Super Admin', title: 'School Director', department: 'Administration', email: 'k.asante@maplegrove.edu.gh', phone: '+233 24 111 2233' },
  { id: 'admin-2', name: 'Mrs. Abena Mensah', role: 'School Administrator', title: 'Head of Administration', department: 'Administration', email: 'a.mensah@maplegrove.edu.gh', phone: '+233 24 222 3344' },
  { id: 'head-1', name: 'Mrs. Esi Boateng', role: 'Headteacher', title: 'Headteacher', department: 'Academic', email: 'e.boateng@maplegrove.edu.gh', phone: '+233 24 333 4455' },
  { id: 'teacher-1', name: 'Miss Ama Darko', role: 'Teacher', title: 'Class Teacher', department: 'Early Years', classId: 'kg1' },
  { id: 'teacher-2', name: 'Mrs. Adwoa Frimpong', role: 'Teacher', title: 'Class Teacher', department: 'Early Years', classId: 'kg2' },
  { id: 'teacher-3', name: 'Mr. Kofi Owusu', role: 'Teacher', title: 'Class Teacher', department: 'Primary', classId: 'p1' },
  { id: 'teacher-4', name: 'Mrs. Akua Sarpong', role: 'Teacher', title: 'Class Teacher', department: 'Primary', classId: 'p2' },
  { id: 'teacher-5', name: 'Mr. Yaw Mensah', role: 'Teacher', title: 'Class Teacher', department: 'Primary', classId: 'p3' },
  { id: 'teacher-6', name: 'Mrs. Efua Addo', role: 'Teacher', title: 'Class Teacher', department: 'Primary', classId: 'p4' },
  { id: 'teacher-7', name: 'Mr. Nana Appiah', role: 'Teacher', title: 'Class Teacher', department: 'Primary', classId: 'p5' },
  { id: 'teacher-8', name: 'Mrs. Adjoa Boateng', role: 'Teacher', title: 'Class Teacher', department: 'Primary', classId: 'p6' },
  { id: 'teacher-9', name: 'Mr. Kwesi Agyeman', role: 'Teacher', title: 'Form Master', department: 'JHS', classId: 'jhs1' },
  { id: 'teacher-10', name: 'Mrs. Maame Pokua', role: 'Teacher', title: 'Form Mistress', department: 'JHS', classId: 'jhs2' },
  { id: 'teacher-11', name: 'Mr. Osei Bonsu', role: 'Teacher', title: 'Form Master', department: 'JHS', classId: 'jhs3' },
  { id: 'accounts-1', name: 'Mr. Daniel Asare', role: 'Accounts Officer', title: 'Bursar', department: 'Finance', email: 'd.asare@maplegrove.edu.gh' },
  { id: 'admissions-1', name: 'Mrs. Grace Tetteh', role: 'Admissions Officer', title: 'Admissions Coordinator', department: 'Admissions', email: 'g.tetteh@maplegrove.edu.gh' },
];

// ---------------------------------------------------------------------------
// STUDENTS
// ---------------------------------------------------------------------------
export const students = [
  // JHS 2 students (for demo parent)
  { id: 'stu-001', name: 'Kofi Mensah', studentId: 'MG/2024/001', classId: 'jhs2', gender: 'Male', dob: '2012-03-15', guardianId: 'guardian-1', house: 'Eagles', programme: 'Cambridge Enrichment', status: 'active', photo: null },
  { id: 'stu-002', name: 'Ama Serwaa', studentId: 'MG/2024/002', classId: 'jhs2', gender: 'Female', dob: '2012-07-22', guardianId: 'guardian-1', house: 'Doves', programme: 'Ghanaian Core', status: 'active', photo: null },
  // Primary 5 student (same parent)
  { id: 'stu-003', name: 'Kwame Mensah Jr.', studentId: 'MG/2024/003', classId: 'p5', gender: 'Male', dob: '2014-11-08', guardianId: 'guardian-1', house: 'Lions', programme: 'Ghanaian Core', status: 'active', photo: null },
  // Other students
  { id: 'stu-004', name: 'Abena Osei', studentId: 'MG/2024/004', classId: 'jhs2', gender: 'Female', dob: '2012-05-10', guardianId: 'guardian-2', house: 'Eagles', programme: 'Cambridge Enrichment', status: 'active', photo: null },
  { id: 'stu-005', name: 'Yaw Asante', studentId: 'MG/2024/005', classId: 'jhs2', gender: 'Male', dob: '2012-09-03', guardianId: 'guardian-3', house: 'Lions', programme: 'Ghanaian Core', status: 'active', photo: null },
  { id: 'stu-006', name: 'Efua Agyeman', studentId: 'MG/2024/006', classId: 'p5', gender: 'Female', dob: '2014-02-18', guardianId: 'guardian-4', house: 'Doves', programme: 'Ghanaian Core', status: 'active', photo: null },
  { id: 'stu-007', name: 'Kwesi Boateng', studentId: 'MG/2024/007', classId: 'jhs1', gender: 'Male', dob: '2013-06-25', guardianId: 'guardian-5', house: 'Eagles', programme: 'Cambridge Enrichment', status: 'active', photo: null },
  { id: 'stu-008', name: 'Adwoa Frimpong', studentId: 'MG/2024/008', classId: 'p3', gender: 'Female', dob: '2016-01-12', guardianId: 'guardian-6', house: 'Doves', programme: 'Ghanaian Core', status: 'active', photo: null },
  { id: 'stu-009', name: 'Nana Appiah', studentId: 'MG/2024/009', classId: 'jhs3', gender: 'Male', dob: '2011-08-30', guardianId: 'guardian-7', house: 'Lions', programme: 'Cambridge Enrichment', status: 'active', photo: null },
  { id: 'stu-010', name: 'Akua Darko', studentId: 'MG/2024/010', classId: 'kg2', gender: 'Female', dob: '2019-04-05', guardianId: 'guardian-8', house: 'Doves', programme: 'Early Years', status: 'active', photo: null },
];

// ---------------------------------------------------------------------------
// GUARDIANS / PARENTS
// ---------------------------------------------------------------------------
export const guardians = [
  { id: 'guardian-1', name: 'Mr. & Mrs. Mensah', email: 'mensah.family@email.com', phone: '+233 24 555 6789', relation: 'Parent', studentIds: ['stu-001', 'stu-002', 'stu-003'] },
  { id: 'guardian-2', name: 'Mrs. Adwoa Osei', email: 'a.osei@email.com', phone: '+233 20 111 2233', relation: 'Mother', studentIds: ['stu-004'] },
  { id: 'guardian-3', name: 'Mr. Kwaku Asante', email: 'k.asante@email.com', phone: '+233 24 444 5566', relation: 'Father', studentIds: ['stu-005'] },
  { id: 'guardian-4', name: 'Mrs. Efua Agyeman', email: 'e.agyeman@email.com', phone: '+233 27 777 8899', relation: 'Mother', studentIds: ['stu-006'] },
  { id: 'guardian-5', name: 'Mr. Kofi Boateng', email: 'k.boateng@email.com', phone: '+233 55 333 4455', relation: 'Father', studentIds: ['stu-007'] },
  { id: 'guardian-6', name: 'Mrs. Ama Frimpong', email: 'a.frimpong@email.com', phone: '+233 24 666 7788', relation: 'Mother', studentIds: ['stu-008'] },
  { id: 'guardian-7', name: 'Mr. Nana Osei', email: 'n.osei@email.com', phone: '+233 20 999 0011', relation: 'Father', studentIds: ['stu-009'] },
  { id: 'guardian-8', name: 'Mrs. Adjoa Darko', email: 'a.darko@email.com', phone: '+233 55 222 3344', relation: 'Mother', studentIds: ['stu-010'] },
];

// Demo login credentials
export const demoUsers = [
  { id: 'parent-1', email: 'parent@demo.com', password: 'demo123', role: 'parent', guardianId: 'guardian-1' },
  { id: 'admin-1', email: 'admin@demo.com', password: 'demo123', role: 'admin', staffId: 'admin-1' },
];

// ---------------------------------------------------------------------------
// SUBJECTS
// ---------------------------------------------------------------------------
export const subjects = {
  jhs: [
    { id: 'math', name: 'Mathematics' },
    { id: 'eng', name: 'English Language' },
    { id: 'sci', name: 'Science' },
    { id: 'soc', name: 'Social Studies' },
    { id: 'gh', name: 'Ghanaian Language' },
    { id: 'rme', name: 'RME' },
    { id: 'ict', name: 'ICT' },
    { id: 'fre', name: 'French' },
  ],
  primary: [
    { id: 'math', name: 'Mathematics' },
    { id: 'eng', name: 'English Language' },
    { id: 'sci', name: 'Science' },
    { id: 'soc', name: 'Social Studies' },
    { id: 'gh', name: 'Ghanaian Language' },
    { id: 'rme', name: 'RME' },
    { id: 'cre', name: 'Creative Arts' },
  ],
};

// ---------------------------------------------------------------------------
// RESULTS (Term 1, 2025/2026)
// ---------------------------------------------------------------------------
export const results = [
  // Kofi Mensah - JHS 2
  { id: 'res-001', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'math', subjectName: 'Mathematics', score: 82, position: 3, classAverage: 68, teacherComment: 'Excellent work. Consistent performance.' },
  { id: 'res-002', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'eng', subjectName: 'English Language', score: 75, position: 5, classAverage: 65, teacherComment: 'Good effort in comprehension. Needs to improve essay writing.' },
  { id: 'res-003', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'sci', subjectName: 'Science', score: 88, position: 1, classAverage: 62, teacherComment: 'Outstanding. A model student in practicals.' },
  { id: 'res-004', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'soc', subjectName: 'Social Studies', score: 71, position: 7, classAverage: 64, teacherComment: 'Good understanding. Participates well in class.' },
  { id: 'res-005', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'gh', subjectName: 'Ghanaian Language', score: 68, position: 8, classAverage: 66, teacherComment: 'Satisfactory. More reading recommended.' },
  { id: 'res-006', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'rme', subjectName: 'RME', score: 79, position: 4, classAverage: 70, teacherComment: 'Very good. Thoughtful responses.' },
  { id: 'res-007', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'ict', subjectName: 'ICT', score: 91, position: 1, classAverage: 60, teacherComment: 'Exceptional. Shows natural aptitude.' },
  { id: 'res-008', studentId: 'stu-001', term: 'term-1', year: '2025-2026', subjectId: 'fre', subjectName: 'French', score: 73, position: 6, classAverage: 63, teacherComment: 'Good progress. Pronunciation improving.' },
  // Ama Serwaa - JHS 2
  { id: 'res-009', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'math', subjectName: 'Mathematics', score: 76, position: 5, classAverage: 68, teacherComment: 'Good work. More practice on algebra needed.' },
  { id: 'res-010', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'eng', subjectName: 'English Language', score: 84, position: 2, classAverage: 65, teacherComment: 'Excellent written work. Strong vocabulary.' },
  { id: 'res-011', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'sci', subjectName: 'Science', score: 72, position: 8, classAverage: 62, teacherComment: 'Satisfactory. Show more interest in practicals.' },
  { id: 'res-012', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'soc', subjectName: 'Social Studies', score: 80, position: 3, classAverage: 64, teacherComment: 'Very good. Well-researched assignments.' },
  { id: 'res-013', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'gh', subjectName: 'Ghanaian Language', score: 85, position: 2, classAverage: 66, teacherComment: 'Excellent. A strong performer.' },
  { id: 'res-014', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'rme', subjectName: 'RME', score: 78, position: 5, classAverage: 70, teacherComment: 'Good. Thoughtful contributions.' },
  { id: 'res-015', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'ict', subjectName: 'ICT', score: 70, position: 9, classAverage: 60, teacherComment: 'Satisfactory. More practice with applications.' },
  { id: 'res-016', studentId: 'stu-002', term: 'term-1', year: '2025-2026', subjectId: 'fre', subjectName: 'French', score: 82, position: 2, classAverage: 63, teacherComment: 'Very good. Good pronunciation.' },
  // Kwame Mensah Jr. - Primary 5
  { id: 'res-017', studentId: 'stu-003', term: 'term-1', year: '2025-2026', subjectId: 'math', subjectName: 'Mathematics', score: 78, position: 6, classAverage: 65, teacherComment: 'Good. Needs to work on word problems.' },
  { id: 'res-018', studentId: 'stu-003', term: 'term-1', year: '2025-2026', subjectId: 'eng', subjectName: 'English Language', score: 72, position: 8, classAverage: 67, teacherComment: 'Fair. Reading habits need improvement.' },
  { id: 'res-019', studentId: 'stu-003', term: 'term-1', year: '2025-2026', subjectId: 'sci', subjectName: 'Science', score: 80, position: 4, classAverage: 63, teacherComment: 'Very good. Shows curiosity.' },
  { id: 'res-020', studentId: 'stu-003', term: 'term-1', year: '2025-2026', subjectId: 'soc', subjectName: 'Social Studies', score: 74, position: 7, classAverage: 66, teacherComment: 'Good. Participates in discussions.' },
  { id: 'res-021', studentId: 'stu-003', term: 'term-1', year: '2025-2026', subjectId: 'gh', subjectName: 'Ghanaian Language', score: 69, position: 10, classAverage: 68, teacherComment: 'Satisfactory. More oral practice needed.' },
  { id: 'res-022', studentId: 'stu-003', term: 'term-1', year: '2025-2026', subjectId: 'rme', subjectName: 'RME', score: 83, position: 3, classAverage: 71, teacherComment: 'Very good. Respectful and attentive.' },
  { id: 'res-023', studentId: 'stu-003', term: 'term-1', year: '2025-2026', subjectId: 'cre', subjectName: 'Creative Arts', score: 86, position: 2, classAverage: 70, teacherComment: 'Excellent. Talented in drawing.' },
];

// ---------------------------------------------------------------------------
// ATTENDANCE
// ---------------------------------------------------------------------------
export const attendance = [
  // Kofi Mensah - recent days
  { id: 'att-001', studentId: 'stu-001', date: '2026-02-02', status: 'present' },
  { id: 'att-002', studentId: 'stu-001', date: '2026-02-03', status: 'present' },
  { id: 'att-003', studentId: 'stu-001', date: '2026-02-04', status: 'present' },
  { id: 'att-004', studentId: 'stu-001', date: '2026-02-05', status: 'late' },
  { id: 'att-005', studentId: 'stu-001', date: '2026-02-06', status: 'present' },
  { id: 'att-006', studentId: 'stu-001', date: '2026-01-26', status: 'present' },
  { id: 'att-007', studentId: 'stu-001', date: '2026-01-27', status: 'present' },
  { id: 'att-008', studentId: 'stu-001', date: '2026-01-28', status: 'absent' },
  { id: 'att-009', studentId: 'stu-001', date: '2026-01-29', status: 'present' },
  { id: 'att-010', studentId: 'stu-001', date: '2026-01-30', status: 'present' },
  // Ama Serwaa
  { id: 'att-011', studentId: 'stu-002', date: '2026-02-02', status: 'present' },
  { id: 'att-012', studentId: 'stu-002', date: '2026-02-03', status: 'present' },
  { id: 'att-013', studentId: 'stu-002', date: '2026-02-04', status: 'present' },
  { id: 'att-014', studentId: 'stu-002', date: '2026-02-05', status: 'present' },
  { id: 'att-015', studentId: 'stu-002', date: '2026-02-06', status: 'present' },
  // Kwame Jr.
  { id: 'att-016', studentId: 'stu-003', date: '2026-02-02', status: 'present' },
  { id: 'att-017', studentId: 'stu-003', date: '2026-02-03', status: 'absent' },
  { id: 'att-018', studentId: 'stu-003', date: '2026-02-04', status: 'present' },
  { id: 'att-019', studentId: 'stu-003', date: '2026-02-05', status: 'present' },
  { id: 'att-020', studentId: 'stu-003', date: '2026-02-06', status: 'late' },
];

// ---------------------------------------------------------------------------
// FEES
// ---------------------------------------------------------------------------
export const feeStructure = [
  { id: 'fee-1', classId: 'jhs2', category: 'Tuition', amount: 3500, term: 'term-2' },
  { id: 'fee-2', classId: 'jhs2', category: 'Feeding', amount: 1200, term: 'term-2' },
  { id: 'fee-3', classId: 'jhs2', category: 'ICT', amount: 350, term: 'term-2' },
  { id: 'fee-4', classId: 'jhs2', category: 'Examination', amount: 200, term: 'term-2' },
  { id: 'fee-5', classId: 'jhs2', category: 'Sports', amount: 150, term: 'term-2' },
  { id: 'fee-6', classId: 'p5', category: 'Tuition', amount: 2800, term: 'term-2' },
  { id: 'fee-7', classId: 'p5', category: 'Feeding', amount: 900, term: 'term-2' },
  { id: 'fee-8', classId: 'p5', category: 'ICT', amount: 250, term: 'term-2' },
  { id: 'fee-9', classId: 'p5', category: 'Examination', amount: 150, term: 'term-2' },
  { id: 'fee-10', classId: 'p5', category: 'Sports', amount: 100, term: 'term-2' },
];

export const feeRecords = [
  // Kofi Mensah - JHS 2
  { id: 'fr-001', studentId: 'stu-001', term: 'term-2', year: '2025-2026', category: 'Tuition', charged: 3500, paid: 3500, balance: 0, status: 'paid' },
  { id: 'fr-002', studentId: 'stu-001', term: 'term-2', year: '2025-2026', category: 'Feeding', charged: 1200, paid: 1200, balance: 0, status: 'paid' },
  { id: 'fr-003', studentId: 'stu-001', term: 'term-2', year: '2025-2026', category: 'ICT', charged: 350, paid: 350, balance: 0, status: 'paid' },
  { id: 'fr-004', studentId: 'stu-001', term: 'term-2', year: '2025-2026', category: 'Examination', charged: 200, paid: 0, balance: 200, status: 'unpaid' },
  { id: 'fr-005', studentId: 'stu-001', term: 'term-2', year: '2025-2026', category: 'Sports', charged: 150, paid: 150, balance: 0, status: 'paid' },
  // Ama Serwaa - JHS 2
  { id: 'fr-006', studentId: 'stu-002', term: 'term-2', year: '2025-2026', category: 'Tuition', charged: 3500, paid: 2000, balance: 1500, status: 'partial' },
  { id: 'fr-007', studentId: 'stu-002', term: 'term-2', year: '2025-2026', category: 'Feeding', charged: 1200, paid: 1200, balance: 0, status: 'paid' },
  { id: 'fr-008', studentId: 'stu-002', term: 'term-2', year: '2025-2026', category: 'ICT', charged: 350, paid: 0, balance: 350, status: 'unpaid' },
  { id: 'fr-009', studentId: 'stu-002', term: 'term-2', year: '2025-2026', category: 'Examination', charged: 200, paid: 0, balance: 200, status: 'unpaid' },
  { id: 'fr-010', studentId: 'stu-002', term: 'term-2', year: '2025-2026', category: 'Sports', charged: 150, paid: 150, balance: 0, status: 'paid' },
  // Kwame Jr. - Primary 5
  { id: 'fr-011', studentId: 'stu-003', term: 'term-2', year: '2025-2026', category: 'Tuition', charged: 2800, paid: 2800, balance: 0, status: 'paid' },
  { id: 'fr-012', studentId: 'stu-003', term: 'term-2', year: '2025-2026', category: 'Feeding', charged: 900, paid: 900, balance: 0, status: 'paid' },
  { id: 'fr-013', studentId: 'stu-003', term: 'term-2', year: '2025-2026', category: 'ICT', charged: 250, paid: 250, balance: 0, status: 'paid' },
  { id: 'fr-014', studentId: 'stu-003', term: 'term-2', year: '2025-2026', category: 'Examination', charged: 150, paid: 150, balance: 0, status: 'paid' },
  { id: 'fr-015', studentId: 'stu-003', term: 'term-2', year: '2025-2026', category: 'Sports', charged: 100, paid: 0, balance: 100, status: 'unpaid' },
];

export const paymentHistory = [
  { id: 'pay-001', studentId: 'stu-001', date: '2026-01-10', amount: 3500, category: 'Tuition', method: 'Mobile Money', reference: 'MOMO-2026-001', receivedBy: 'Daniel Asare' },
  { id: 'pay-002', studentId: 'stu-001', date: '2026-01-10', amount: 1200, category: 'Feeding', method: 'Mobile Money', reference: 'MOMO-2026-002', receivedBy: 'Daniel Asare' },
  { id: 'pay-003', studentId: 'stu-001', date: '2026-01-12', amount: 500, category: 'ICT', method: 'Bank Transfer', reference: 'BT-2026-001', receivedBy: 'Daniel Asare' },
  { id: 'pay-004', studentId: 'stu-001', date: '2026-01-15', amount: 150, category: 'Sports', method: 'Cash', reference: 'CSH-2026-001', receivedBy: 'Daniel Asare' },
  { id: 'pay-005', studentId: 'stu-002', date: '2026-01-11', amount: 2000, category: 'Tuition', method: 'Mobile Money', reference: 'MOMO-2026-003', receivedBy: 'Daniel Asare' },
  { id: 'pay-006', studentId: 'stu-002', date: '2026-01-11', amount: 1200, category: 'Feeding', method: 'Mobile Money', reference: 'MOMO-2026-004', receivedBy: 'Daniel Asare' },
  { id: 'pay-007', studentId: 'stu-002', date: '2026-01-14', amount: 150, category: 'Sports', method: 'Cash', reference: 'CSH-2026-002', receivedBy: 'Daniel Asare' },
  { id: 'pay-008', studentId: 'stu-003', date: '2026-01-09', amount: 2800, category: 'Tuition', method: 'Bank Transfer', reference: 'BT-2026-002', receivedBy: 'Daniel Asare' },
  { id: 'pay-009', studentId: 'stu-003', date: '2026-01-09', amount: 900, category: 'Feeding', method: 'Mobile Money', reference: 'MOMO-2026-005', receivedBy: 'Daniel Asare' },
  { id: 'pay-010', studentId: 'stu-003', date: '2026-01-10', amount: 400, category: 'ICT + Examination', method: 'Cash', reference: 'CSH-2026-003', receivedBy: 'Daniel Asare' },
];

// ---------------------------------------------------------------------------
// TIMETABLE (JHS 2)
// ---------------------------------------------------------------------------
export const timetable = [
  { day: 'Monday', periods: [
    { time: '7:30 - 8:15', subject: 'Mathematics', teacher: 'Mr. Kwesi Agyeman' },
    { time: '8:15 - 9:00', subject: 'English Language', teacher: 'Mrs. Maame Pokua' },
    { time: '9:15 - 10:00', subject: 'Science', teacher: 'Mr. Osei Bonsu' },
    { time: '10:15 - 11:00', subject: 'French', teacher: 'Mme. Adwoa Asante' },
    { time: '11:15 - 12:00', subject: 'ICT', teacher: 'Mr. Kofi Owusu' },
    { time: '12:00 - 12:45', subject: 'RME', teacher: 'Pastor James Mensah' },
  ]},
  { day: 'Tuesday', periods: [
    { time: '7:30 - 8:15', subject: 'Social Studies', teacher: 'Mrs. Efua Addo' },
    { time: '8:15 - 9:00', subject: 'Mathematics', teacher: 'Mr. Kwesi Agyeman' },
    { time: '9:15 - 10:00', subject: 'Ghanaian Language', teacher: 'Nana Yaa Serwaa' },
    { time: '10:15 - 11:00', subject: 'Science', teacher: 'Mr. Osei Bonsu' },
    { time: '11:15 - 12:00', subject: 'English Language', teacher: 'Mrs. Maame Pokua' },
    { time: '12:00 - 12:45', subject: 'Creative Arts', teacher: 'Mr. Adu Ampofo' },
  ]},
  { day: 'Wednesday', periods: [
    { time: '7:30 - 8:15', subject: 'English Language', teacher: 'Mrs. Maame Pokua' },
    { time: '8:15 - 9:00', subject: 'Mathematics', teacher: 'Mr. Kwesi Agyeman' },
    { time: '9:15 - 10:00', subject: 'ICT', teacher: 'Mr. Kofi Owusu' },
    { time: '10:15 - 11:00', subject: 'French', teacher: 'Mme. Adwoa Asante' },
    { time: '11:15 - 12:00', subject: 'Social Studies', teacher: 'Mrs. Efua Addo' },
    { time: '12:00 - 12:45', subject: 'RME', teacher: 'Pastor James Mensah' },
  ]},
  { day: 'Thursday', periods: [
    { time: '7:30 - 8:15', subject: 'Science', teacher: 'Mr. Osei Bonsu' },
    { time: '8:15 - 9:00', subject: 'Ghanaian Language', teacher: 'Nana Yaa Serwaa' },
    { time: '9:15 - 10:00', subject: 'Mathematics', teacher: 'Mr. Kwesi Agyeman' },
    { time: '10:15 - 11:00', subject: 'English Language', teacher: 'Mrs. Maame Pokua' },
    { time: '11:15 - 12:00', subject: 'French', teacher: 'Mme. Adwoa Asante' },
    { time: '12:00 - 12:45', subject: 'Physical Education', teacher: 'Coach Kwame Frimpong' },
  ]},
  { day: 'Friday', periods: [
    { time: '7:30 - 8:15', subject: 'Mathematics', teacher: 'Mr. Kwesi Agyeman' },
    { time: '8:15 - 9:00', subject: 'Science', teacher: 'Mr. Osei Bonsu' },
    { time: '9:15 - 10:00', subject: 'Social Studies', teacher: 'Mrs. Efua Addo' },
    { time: '10:15 - 11:00', subject: 'English Language', teacher: 'Mrs. Maame Pokua' },
    { time: '11:15 - 12:00', subject: 'ICT', teacher: 'Mr. Kofi Owusu' },
    { time: '12:00 - 12:45', subject: 'Clubs / Assembly', teacher: 'Various' },
  ]},
];

// ---------------------------------------------------------------------------
// NEWS & ANNOUNCEMENTS
// ---------------------------------------------------------------------------
export const news = [
  { id: 'news-1', title: 'Second Term Opens with Record Enrolment', date: '2026-01-12', category: 'School News', excerpt: 'Maple Grove International School begins the second term with over 320 students, marking a 15% increase from last year.', content: 'We are pleased to announce that the second term of the 2025/2026 academic year has opened with a record enrolment of over 320 students across all levels. This represents a 15% increase compared to the same period last year, reflecting the growing confidence parents have in our educational approach.', featured: true },
  { id: 'news-2', title: 'Inter-School Quiz Competition Victory', date: '2026-01-28', category: 'Achievement', excerpt: 'Our JHS quiz team wins the Ashanti Regional Inter-Schools competition for the second consecutive year.', content: 'Congratulations to our JHS quiz team who brought home the trophy at the Ashanti Regional Inter-Schools Quiz Competition held at Prempeh College. This is the second consecutive year our students have won this prestigious competition.', featured: true },
  { id: 'news-3', title: 'Cambridge Assessment Results Published', date: '2026-01-20', category: 'Academics', excerpt: 'Check the latest Cambridge Progression Test results for our Cambridge Enrichment stream students.', content: 'The Cambridge Progression Test results for Term 1 have been published. Our Cambridge Enrichment stream students performed exceptionally well, with 85% achieving above the global average in Mathematics and Science.' },
  { id: 'news-4', title: 'PTA Meeting Scheduled for February', date: '2026-02-01', category: 'Announcement', excerpt: 'All parents are invited to the Second Term PTA meeting on Saturday, February 15th at 10am.', content: 'The Parent-Teacher Association meeting for the second term is scheduled for Saturday, February 15th, 2026 at 10:00am in the school hall. All parents and guardians are encouraged to attend. Agenda items include academic progress reports, fee adjustments for next year, and the upcoming cultural festival.' },
  { id: 'news-5', title: 'New Science Laboratory Commissioned', date: '2025-12-15', category: 'Facilities', excerpt: 'Our state-of-the-art science laboratory is now fully operational, enhancing practical learning.', content: 'We are proud to commission our new science laboratory, equipped with modern apparatus and safety features. This facility will significantly enhance practical learning in Biology, Chemistry and Physics for our JHS students.' },
];

export const announcements = [
  { id: 'ann-1', title: 'Mid-Term Break Dates', date: '2026-02-14', audience: 'all', content: 'Mid-term break will be from February 17th to February 21st. School resumes on Monday, February 24th.' },
  { id: 'ann-2', title: 'Sports Day Preparations', date: '2026-02-10', audience: 'all', content: 'Annual Sports Day is scheduled for March 14th. Parents should ensure their children have complete sports kits.' },
  { id: 'ann-3', title: 'Fee Payment Reminder', date: '2026-02-01', audience: 'parents', content: 'Parents with outstanding fee balances are kindly requested to clear them before the mid-term break.' },
  { id: 'ann-4', title: 'JHS 3 Career Guidance Session', date: '2026-02-08', audience: 'jhs', content: 'Career guidance sessions for JHS 3 students begin next week. Students should see their form masters for details.' },
];

// ---------------------------------------------------------------------------
// EVENTS
// ---------------------------------------------------------------------------
export const events = [
  { id: 'evt-1', title: 'PTA Meeting', date: '2026-02-15', time: '10:00 AM', location: 'School Hall', type: 'meeting' },
  { id: 'evt-2', title: 'Mid-Term Break', date: '2026-02-17', endDate: '2026-02-21', time: 'All Day', location: '', type: 'holiday' },
  { id: 'evt-3', title: 'Inter-House Sports Competition', date: '2026-03-07', time: '8:00 AM', location: 'Sports Field', type: 'sports' },
  { id: 'evt-4', title: 'Annual Sports Day', date: '2026-03-14', time: '8:00 AM', location: 'Sports Field', type: 'sports' },
  { id: 'evt-5', title: 'Cultural Festival', date: '2026-03-28', time: '9:00 AM', location: 'School Grounds', type: 'cultural' },
  { id: 'evt-6', title: 'End of Term Examinations Begin', date: '2026-03-23', endDate: '2026-03-27', time: '8:00 AM', location: 'Exam Halls', type: 'academic' },
  { id: 'evt-7', title: 'Third Term Opens', date: '2026-04-27', time: '7:30 AM', location: '', type: 'academic' },
];

// ---------------------------------------------------------------------------
// ADMISSIONS APPLICATIONS
// ---------------------------------------------------------------------------
export const admissionApplications = [
  { id: 'app-001', childName: 'Adwoa Boateng', dob: '2018-06-15', applyingFor: 'KG 2', parentName: 'Mrs. Yaa Boateng', parentPhone: '+233 24 888 9900', parentEmail: 'y.boateng@email.com', status: 'pending', date: '2026-01-28', notes: '' },
  { id: 'app-002', childName: 'Kwame Asare', dob: '2016-03-22', applyingFor: 'Primary 4', parentName: 'Mr. & Mrs. Asare', parentPhone: '+233 20 777 6655', parentEmail: 'asare.family@email.com', status: 'pending', date: '2026-01-30', notes: '' },
  { id: 'app-003', childName: 'Esi Mensah', dob: '2014-09-10', applyingFor: 'JHS 1', parentName: 'Mrs. Abena Mensah', parentPhone: '+233 55 444 3322', parentEmail: 'ab.mensah@email.com', status: 'under_review', date: '2026-01-25', notes: 'Previous school records requested.' },
  { id: 'app-004', childName: 'Nana Frimpong', dob: '2019-01-05', applyingFor: 'KG 1', parentName: 'Mr. Kofi Frimpong', parentPhone: '+233 27 333 2211', parentEmail: 'k.frimpong@email.com', status: 'accepted', date: '2026-01-15', notes: 'Interview completed. Welcome package sent.' },
  { id: 'app-005', childName: 'Akua Owusu', dob: '2017-11-28', applyingFor: 'Primary 2', parentName: 'Mrs. Adjoa Owusu', parentPhone: '+233 24 111 0099', parentEmail: 'a.owusu@email.com', status: 'pending', date: '2026-02-01', notes: '' },
];

// ---------------------------------------------------------------------------
// GALLERY
// ---------------------------------------------------------------------------
export const galleryAlbums = [
  { id: 'gal-1', title: 'Annual Cultural Festival 2025', date: '2025-11-20', imageCount: 24, cover: 'cultural' },
  { id: 'gal-2', title: 'Inter-Schools Quiz Victory', date: '2026-01-28', imageCount: 12, cover: 'quiz' },
  { id: 'gal-3', title: 'Science Laboratory Opening', date: '2025-12-15', imageCount: 18, cover: 'lab' },
  { id: 'gal-4', title: 'Sports Day 2025', date: '2025-10-12', imageCount: 30, cover: 'sports' },
  { id: 'gal-5', title: 'First Term Graduation', date: '2025-12-19', imageCount: 20, cover: 'graduation' },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------
export function getStudentById(id: string) {
  return students.find(s => s.id === id);
}

export function getClassById(id: string) {
  return classes.find(c => c.id === id);
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
