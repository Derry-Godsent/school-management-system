/**
 * Portal data.
 *
 * Everything the parent portal shows a family about a ward: the class and who
 * teaches it, how the term is going subject by subject, the work that has been
 * marked and the work that is due, attendance, fees, the class list, and the
 * notices the school has sent.
 *
 * This is demonstration data for a showcase. It is deliberately consistent with
 * the rest of the sample data in this folder (three wards of one guardian, the
 * same class names, the same term) so that a school looking at the pitch sees
 * one coherent picture rather than numbers that contradict each other.
 *
 * Averages are never written down by hand where they can be read off the work.
 * The subject scores produce the ward's average, the roster produces the class
 * rank, and the fee lines produce the balance, so nothing can drift out of step
 * with itself.
 */

// ---------------------------------------------------------------------------
// Teachers
// ---------------------------------------------------------------------------
export interface Teacher {
  name: string;
  subject?: string;
  role?: string;
  phone: string;
  email: string;
}

const T = {
  vivian: { name: 'Madam Vivian Adjei', role: 'Form teacher', phone: '+233 24 333 4455', email: 'v.adjei@maplegrove.edu.gh' },
  seth: { name: 'Mr. Seth Owusu', subject: 'Mathematics', phone: '+233 20 111 2233', email: 's.owusu@maplegrove.edu.gh' },
  rebecca: { name: 'Madam Rebecca Danso', subject: 'English Language', phone: '+233 24 222 3344', email: 'r.danso@maplegrove.edu.gh' },
  bright: { name: 'Mr. Bright Kusi', subject: 'Integrated Science', phone: '+233 20 333 4455', email: 'b.kusi@maplegrove.edu.gh' },
  patience: { name: 'Madam Patience Boakye', subject: 'Social Studies', phone: '+233 27 444 5566', email: 'p.boakye@maplegrove.edu.gh' },
  yeboah: { name: 'Mr. Nana Yeboah', subject: 'ICT', phone: '+233 24 555 6677', email: 'n.yeboah@maplegrove.edu.gh' },
  celine: { name: 'Madam Celine Adjoa', subject: 'French', phone: '+233 20 666 7788', email: 'c.adjoa@maplegrove.edu.gh' },
  emmanuel: { name: 'Mr. Emmanuel Adjei', subject: 'Religious and Moral Education', phone: '+233 27 777 8899', email: 'e.adjei@maplegrove.edu.gh' },
  akua: { name: 'Madam Akua Sarpong', subject: 'Ghanaian Language', phone: '+233 24 888 9900', email: 'a.sarpong@maplegrove.edu.gh' },
  eric: { name: 'Mr. Eric Baffour', subject: 'Career Technology', phone: '+233 20 999 0011', email: 'e.baffour@maplegrove.edu.gh' },
  grace: { name: 'Madam Grace Antwi', role: 'Form teacher', phone: '+233 24 123 9876', email: 'g.antwi@maplegrove.edu.gh' },
  isaac: { name: 'Mr. Isaac Larbi', subject: 'Mathematics', phone: '+233 20 234 5678', email: 'i.larbi@maplegrove.edu.gh' },
  cynthia: { name: 'Madam Cynthia Owusu', subject: 'English Language', phone: '+233 27 345 6789', email: 'c.owusu@maplegrove.edu.gh' },
  badu: { name: 'Mr. Kofi Badu', subject: 'Science', phone: '+233 24 456 7890', email: 'k.badu@maplegrove.edu.gh' },
  rita: { name: 'Madam Rita Amoah', subject: 'Our World Our People', phone: '+233 20 567 8901', email: 'r.amoah@maplegrove.edu.gh' },
  doris: { name: 'Madam Doris Appiah', subject: 'Creative Arts', phone: '+233 27 678 9012', email: 'd.appiah@maplegrove.edu.gh' },
};

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------
export interface ClassInfo {
  id: string;
  name: string;
  room: string;
  formTeacher: Teacher;
  subjectTeachers: Teacher[];
  presentToday: number;
  termAttendance: number;
  todayLessons: { time: string; subject: string; teacher: string; room: string }[];
}

export const classInfo: Record<string, ClassInfo> = {
  jhs2: {
    id: 'jhs2',
    name: 'JHS 2',
    room: 'Block B, Room 4',
    formTeacher: T.vivian,
    subjectTeachers: [T.seth, T.rebecca, T.bright, T.patience, T.yeboah, T.celine, T.emmanuel, T.akua, T.eric],
    presentToday: 22,
    termAttendance: 96,
    todayLessons: [
      { time: '7:30', subject: 'Mathematics', teacher: 'Mr. Seth Owusu', room: 'Block B, Room 4' },
      { time: '9:10', subject: 'Integrated Science', teacher: 'Mr. Bright Kusi', room: 'Science Lab 1' },
      { time: '11:20', subject: 'English Language', teacher: 'Madam Rebecca Danso', room: 'Block B, Room 4' },
      { time: '13:00', subject: 'ICT', teacher: 'Mr. Nana Yeboah', room: 'ICT Laboratory' },
    ],
  },
  p5: {
    id: 'p5',
    name: 'Primary 5',
    room: 'Block A, Room 2',
    formTeacher: T.grace,
    subjectTeachers: [T.isaac, T.cynthia, T.badu, T.rita, T.yeboah, T.doris, T.akua],
    presentToday: 19,
    termAttendance: 94,
    todayLessons: [
      { time: '7:30', subject: 'Mathematics', teacher: 'Mr. Isaac Larbi', room: 'Block A, Room 2' },
      { time: '9:10', subject: 'English Language', teacher: 'Madam Cynthia Owusu', room: 'Block A, Room 2' },
      { time: '10:40', subject: 'Science', teacher: 'Mr. Kofi Badu', room: 'Science Room' },
      { time: '12:30', subject: 'Creative Arts', teacher: 'Madam Doris Appiah', room: 'Art Room' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Subject results
// ---------------------------------------------------------------------------
export interface SubjectResult {
  subject: string;
  teacher: string;
  score: number;
  classAverage: number;
  position: number;
  previous: number;
}

export interface Assessment {
  subject: string;
  title: string;
  type: 'Assignment' | 'Quiz' | 'Class test' | 'Project';
  score: number | null;
  outOf: number;
  date: string;
  due?: boolean;
}

export interface WardProfile {
  studentId: string;
  classId: string;
  subjects: SubjectResult[];
  assessments: Assessment[];
  attendance: {
    /** The most recent school days, oldest first. */
    recent: { date: string; status: 'present' | 'absent' | 'late' }[];
    daysOpen: number;
    present: number;
    late: number;
    absent: number;
  };
  fees: {
    lines: { category: string; charged: number; paid: number }[];
    nextDue: { date: string; amount: number; note: string };
    history: { date: string; amount: number; method: string; reference: string; category: string }[];
  };
  reports: { term: string; average: number; position: number; size: number }[];
  remark: { form: string; head: string };
}

export const wardProfiles: Record<string, WardProfile> = {
  // ---------------------------------------------------------------- ward one
  '1': {
    studentId: '1',
    classId: 'jhs2',
    subjects: [
      { subject: 'Mathematics', teacher: T.seth.name, score: 88, classAverage: 68, position: 2, previous: 82 },
      { subject: 'English Language', teacher: T.rebecca.name, score: 71, classAverage: 65, position: 7, previous: 75 },
      { subject: 'Integrated Science', teacher: T.bright.name, score: 84, classAverage: 66, position: 3, previous: 79 },
      { subject: 'Social Studies', teacher: T.patience.name, score: 76, classAverage: 67, position: 5, previous: 74 },
      { subject: 'ICT', teacher: T.yeboah.name, score: 91, classAverage: 72, position: 1, previous: 88 },
      { subject: 'French', teacher: T.celine.name, score: 63, classAverage: 62, position: 9, previous: 66 },
      { subject: 'Religious and Moral Education', teacher: T.emmanuel.name, score: 79, classAverage: 69, position: 4, previous: 77 },
      { subject: 'Ghanaian Language', teacher: T.akua.name, score: 74, classAverage: 68, position: 6, previous: 71 },
      { subject: 'Career Technology', teacher: T.eric.name, score: 80, classAverage: 70, position: 4, previous: 78 },
    ],
    assessments: [
      { subject: 'Mathematics', title: 'Quadratic expressions exercise', type: 'Assignment', score: 18, outOf: 20, date: '2026-02-12' },
      { subject: 'Integrated Science', title: 'Photosynthesis quiz', type: 'Quiz', score: 15, outOf: 15, date: '2026-02-10' },
      { subject: 'English Language', title: 'Argumentative essay', type: 'Assignment', score: 22, outOf: 30, date: '2026-02-09' },
      { subject: 'ICT', title: 'Spreadsheet practical', type: 'Project', score: 27, outOf: 30, date: '2026-02-06' },
      { subject: 'Social Studies', title: 'Regional government test', type: 'Class test', score: 24, outOf: 30, date: '2026-02-05' },
      { subject: 'French', title: 'Verb conjugation quiz', type: 'Quiz', score: 9, outOf: 15, date: '2026-02-04' },
      { subject: 'Mathematics', title: 'Angles and bearings test', type: 'Class test', score: null, outOf: 30, date: '2026-02-20', due: true },
      { subject: 'Career Technology', title: 'Design portfolio', type: 'Project', score: null, outOf: 40, date: '2026-02-24', due: true },
    ],
    attendance: {
      recent: [
        { date: '2026-02-02', status: 'present' },
        { date: '2026-02-03', status: 'present' },
        { date: '2026-02-04', status: 'present' },
        { date: '2026-02-05', status: 'late' },
        { date: '2026-02-06', status: 'present' },
        { date: '2026-02-09', status: 'present' },
        { date: '2026-02-10', status: 'absent' },
        { date: '2026-02-11', status: 'present' },
        { date: '2026-02-12', status: 'present' },
        { date: '2026-02-13', status: 'present' },
        { date: '2026-02-16', status: 'present' },
        { date: '2026-02-17', status: 'present' },
      ],
      daysOpen: 42,
      present: 38,
      late: 3,
      absent: 1,
    },
    fees: {
      lines: [
        { category: 'Tuition, second instalment', charged: 3500, paid: 3000 },
        { category: 'Feeding', charged: 1200, paid: 1200 },
        { category: 'ICT and examination', charged: 500, paid: 500 },
        { category: 'Transport', charged: 900, paid: 600 },
        { category: 'Books and stationery', charged: 350, paid: 200 },
      ],
      nextDue: { date: '2026-02-28', amount: 950, note: 'Clear before the end of the month to avoid the arrears list.' },
      history: [
        { date: '2026-01-10', amount: 3500, method: 'Mobile Money', reference: 'MOMO-2026-001', category: 'Tuition' },
        { date: '2026-01-10', amount: 1200, method: 'Mobile Money', reference: 'MOMO-2026-002', category: 'Feeding' },
        { date: '2026-01-12', amount: 500, method: 'Bank transfer', reference: 'BT-2026-001', category: 'ICT and examination' },
        { date: '2026-02-03', amount: 300, method: 'Mobile Money', reference: 'MOMO-2026-014', category: 'Books and stationery' },
      ],
    },
    reports: [
      { term: 'First Term', average: 77.2, position: 12, size: 24 },
      { term: 'Second Term', average: 78.4, position: 10, size: 24 },
    ],
    remark: {
      form:
        'Kwame has settled into JHS 2 well. His ICT work is ahead of the class and he answers questions with confidence. He should give French more time at home, and hand in assignments on the day they are due.',
      head: 'A steady term. The French grade is the one to lift before the end of term examinations.',
    },
  },

  // ---------------------------------------------------------------- ward two
  '2': {
    studentId: '2',
    classId: 'jhs2',
    subjects: [
      { subject: 'Mathematics', teacher: T.seth.name, score: 74, classAverage: 68, position: 6, previous: 71 },
      { subject: 'English Language', teacher: T.rebecca.name, score: 86, classAverage: 65, position: 2, previous: 84 },
      { subject: 'Integrated Science', teacher: T.bright.name, score: 79, classAverage: 66, position: 4, previous: 76 },
      { subject: 'Social Studies', teacher: T.patience.name, score: 82, classAverage: 67, position: 3, previous: 80 },
      { subject: 'ICT', teacher: T.yeboah.name, score: 77, classAverage: 72, position: 5, previous: 75 },
      { subject: 'French', teacher: T.celine.name, score: 81, classAverage: 62, position: 3, previous: 78 },
      { subject: 'Religious and Moral Education', teacher: T.emmanuel.name, score: 85, classAverage: 69, position: 2, previous: 83 },
      { subject: 'Ghanaian Language', teacher: T.akua.name, score: 88, classAverage: 68, position: 1, previous: 86 },
      { subject: 'Career Technology', teacher: T.eric.name, score: 76, classAverage: 70, position: 5, previous: 74 },
    ],
    assessments: [
      { subject: 'Ghanaian Language', title: 'Proverb essay', type: 'Assignment', score: 26, outOf: 30, date: '2026-02-13' },
      { subject: 'English Language', title: 'Debate preparation notes', type: 'Assignment', score: 28, outOf: 30, date: '2026-02-11' },
      { subject: 'Religious and Moral Education', title: 'The good life quiz', type: 'Quiz', score: 13, outOf: 15, date: '2026-02-09' },
      { subject: 'Mathematics', title: 'Simultaneous equations', type: 'Class test', score: 21, outOf: 30, date: '2026-02-06' },
      { subject: 'Social Studies', title: 'Our district council', type: 'Project', score: 33, outOf: 40, date: '2026-02-04' },
      { subject: 'Mathematics', title: 'Angles and bearings test', type: 'Class test', score: null, outOf: 30, date: '2026-02-20', due: true },
    ],
    attendance: {
      recent: [
        { date: '2026-02-02', status: 'present' },
        { date: '2026-02-03', status: 'present' },
        { date: '2026-02-04', status: 'present' },
        { date: '2026-02-05', status: 'present' },
        { date: '2026-02-06', status: 'late' },
        { date: '2026-02-09', status: 'present' },
        { date: '2026-02-10', status: 'present' },
        { date: '2026-02-11', status: 'present' },
        { date: '2026-02-12', status: 'present' },
        { date: '2026-02-13', status: 'present' },
        { date: '2026-02-16', status: 'present' },
        { date: '2026-02-17', status: 'present' },
      ],
      daysOpen: 42,
      present: 40,
      late: 2,
      absent: 0,
    },
    fees: {
      lines: [
        { category: 'Tuition, second instalment', charged: 3500, paid: 3500 },
        { category: 'Feeding', charged: 1200, paid: 1200 },
        { category: 'ICT and examination', charged: 500, paid: 500 },
        { category: 'Transport', charged: 900, paid: 900 },
        { category: 'Books and stationery', charged: 350, paid: 350 },
      ],
      nextDue: { date: '2026-04-24', amount: 0, note: 'Next term fees are not billed yet. The bill appears two weeks before the term opens.' },
      history: [
        { date: '2026-01-08', amount: 3500, method: 'Bank transfer', reference: 'BT-2026-004', category: 'Tuition' },
        { date: '2026-01-08', amount: 1200, method: 'Bank transfer', reference: 'BT-2026-005', category: 'Feeding' },
        { date: '2026-01-15', amount: 500, method: 'Mobile Money', reference: 'MOMO-2026-021', category: 'ICT and examination' },
        { date: '2026-01-28', amount: 900, method: 'Mobile Money', reference: 'MOMO-2026-033', category: 'Transport' },
        { date: '2026-01-28', amount: 350, method: 'Mobile Money', reference: 'MOMO-2026-034', category: 'Books and stationery' },
      ],
    },
    reports: [
      { term: 'First Term', average: 78.6, position: 9, size: 24 },
      { term: 'Second Term', average: 80.9, position: 6, size: 24 },
    ],
    remark: {
      form:
        'Ama is a careful, steady worker and a good influence on the girls around her. She speaks up well in class discussion and her written English is strong. Mathematics is the one to keep an eye on, and I have put her in the Thursday afternoon group.',
      head: 'A strong term. Ama is now sixth in a class of twenty four, up three places.',
    },
  },

  // -------------------------------------------------------------- ward three
  '3': {
    studentId: '3',
    classId: 'p5',
    subjects: [
      { subject: 'Mathematics', teacher: T.isaac.name, score: 69, classAverage: 71, position: 11, previous: 64 },
      { subject: 'English Language', teacher: T.cynthia.name, score: 78, classAverage: 70, position: 5, previous: 74 },
      { subject: 'Science', teacher: T.badu.name, score: 82, classAverage: 72, position: 3, previous: 79 },
      { subject: 'Our World Our People', teacher: T.rita.name, score: 75, classAverage: 73, position: 8, previous: 73 },
      { subject: 'ICT', teacher: T.yeboah.name, score: 88, classAverage: 74, position: 2, previous: 85 },
      { subject: 'Creative Arts', teacher: T.doris.name, score: 91, classAverage: 76, position: 1, previous: 89 },
      { subject: 'Ghanaian Language', teacher: T.akua.name, score: 80, classAverage: 72, position: 4, previous: 77 },
    ],
    assessments: [
      { subject: 'Creative Arts', title: 'Market scene painting', type: 'Project', score: 38, outOf: 40, date: '2026-02-12' },
      { subject: 'ICT', title: 'Typing test', type: 'Class test', score: 24, outOf: 25, date: '2026-02-11' },
      { subject: 'English Language', title: 'Reading aloud', type: 'Class test', score: 17, outOf: 20, date: '2026-02-09' },
      { subject: 'Science', title: 'Plants and water quiz', type: 'Quiz', score: 12, outOf: 15, date: '2026-02-05' },
      { subject: 'Mathematics', title: 'Long division exercise', type: 'Assignment', score: 14, outOf: 20, date: '2026-02-04' },
      { subject: 'Mathematics', title: 'Times tables check', type: 'Quiz', score: null, outOf: 20, date: '2026-02-19', due: true },
    ],
    attendance: {
      recent: [
        { date: '2026-02-02', status: 'present' },
        { date: '2026-02-03', status: 'present' },
        { date: '2026-02-04', status: 'absent' },
        { date: '2026-02-05', status: 'present' },
        { date: '2026-02-06', status: 'late' },
        { date: '2026-02-09', status: 'present' },
        { date: '2026-02-10', status: 'present' },
        { date: '2026-02-11', status: 'absent' },
        { date: '2026-02-12', status: 'present' },
        { date: '2026-02-13', status: 'present' },
        { date: '2026-02-16', status: 'present' },
        { date: '2026-02-17', status: 'present' },
      ],
      daysOpen: 42,
      present: 37,
      late: 2,
      absent: 3,
    },
    fees: {
      lines: [
        { category: 'Tuition, second instalment', charged: 2800, paid: 2400 },
        { category: 'Feeding', charged: 1000, paid: 1000 },
        { category: 'ICT and examination', charged: 350, paid: 350 },
        { category: 'Transport', charged: 500, paid: 200 },
        { category: 'Books and stationery', charged: 200, paid: 150 },
      ],
      nextDue: { date: '2026-02-28', amount: 750, note: 'Clear before the end of the month to avoid the arrears list.' },
      history: [
        { date: '2026-01-10', amount: 2400, method: 'Mobile Money', reference: 'MOMO-2026-003', category: 'Tuition' },
        { date: '2026-01-10', amount: 1000, method: 'Mobile Money', reference: 'MOMO-2026-004', category: 'Feeding' },
        { date: '2026-01-20', amount: 350, method: 'Mobile Money', reference: 'MOMO-2026-026', category: 'ICT and examination' },
        { date: '2026-02-02', amount: 150, method: 'Cash at the office', reference: 'RCP-2026-118', category: 'Books and stationery' },
      ],
    },
    reports: [
      { term: 'First Term', average: 76.8, position: 9, size: 20 },
      { term: 'Second Term', average: 80.4, position: 7, size: 20 },
    ],
    remark: {
      form:
        'Kwame has had a good term in Primary 5. He reads well and he is proud of his artwork, which was the best in the class this term. Mathematics needs attention at home, and he should not miss school days as he did in January.',
      head: 'A good term. Please help him with his tables over the break.',
    },
  },
};

// ---------------------------------------------------------------------------
// The class list
// ---------------------------------------------------------------------------
export interface Classmate {
  id: string;
  name: string;
  /** A duty or a standing in the class, where there is one. */
  badge?: string;
  /** Their strongest subject this term. */
  best: string;
  /** One or two lines about them, written for a parent to read. */
  about: string;
  /** Term average, which is what the class rank is built from. */
  average: number;
}

/** Peers only. The guardian's own wards are merged in by classRoster(). */
const classmates: Record<string, Classmate[]> = {
  jhs2: [
    { id: 'c1', name: 'Akosua Frimpong', badge: 'Top of the class', best: 'Mathematics', average: 85.2, about: 'Came first in the class this term. She stays behind to help others with mathematics and she runs the Friday study group.' },
    { id: 'c2', name: 'Abena Owusu', badge: 'Class prefect', best: 'English Language', average: 84.1, about: 'Keeps the class register, reads the notices at assembly, and settles disputes before they reach the form teacher.' },
    { id: 'c3', name: 'Nana Ama Agyeman', badge: 'Best in mathematics', best: 'Mathematics', average: 83.6, about: 'Never misses a mathematics exercise. She represents the class in the inter house quiz.' },
    { id: 'c4', name: 'Kojo Antwi', badge: 'Best in science', best: 'Integrated Science', average: 82.4, about: 'Builds small circuits at home and brings them to show the class. He wants to study engineering.' },
    { id: 'c5', name: 'Yaw Boateng', badge: 'Assistant prefect', best: 'Social Studies', average: 81.8, about: 'Assists the class prefect and takes charge of the class when the teachers are at assembly.' },
    { id: 'c6', name: 'Yaa Asantewaa Boakye', badge: 'Best in English', best: 'English Language', average: 79.9, about: 'Reads a new book almost every week and leads the class library box.' },
    { id: 'c7', name: 'Kofi Danso', badge: 'Sports captain', best: 'Career Technology', average: 79.4, about: 'Captains the football team and organises the house sports practices on Wednesdays.' },
    { id: 'c8', name: 'Adwoa Nyarko', badge: 'Library prefect', best: 'Ghanaian Language', average: 78.9, about: 'Looks after the class readers and keeps the shelf in order. She is soft spoken but very organised.' },
    { id: 'c9', name: 'Kwabena Osei', badge: 'Entertainment prefect', best: 'ICT', average: 77.8, about: 'Arranges the Friday entertainment slot and is the first to volunteer for anything on stage.' },
    { id: 'c10', name: 'Efua Sarpong', badge: 'Debate captain', best: 'English Language', average: 77.2, about: 'Captains the class debate team and argues a point for as long as it takes to win it.' },
    { id: 'c11', name: 'Nii Armah Tetteh', best: 'Integrated Science', average: 76.9, about: 'Quiet in class but strong in practical work. He shares his science notes without being asked.' },
    { id: 'c12', name: 'Fiifi Amankwah', best: 'Career Technology', average: 76.4, about: 'Good with his hands. He repaired the classroom door hinge himself during the last break.' },
    { id: 'c13', name: 'Esi Appiah', best: 'Ghanaian Language', average: 75.8, about: 'Sings in the school choir and knows more folk songs than anyone else in the class.' },
    { id: 'c14', name: 'Kwesi Amoah', best: 'Social Studies', average: 75.1, about: 'Follows the news closely and often brings a story from home to start the morning discussion.' },
    { id: 'c15', name: 'Afia Bediako', best: 'English Language', average: 74.6, about: 'Reliable and neat in her work. She keeps the class notice board tidy.' },
    { id: 'c16', name: 'Mabel Adjei', best: 'Religious and Moral Education', average: 73.9, about: 'Leads the class in the morning prayer and looks after the younger pupils at the bus stop.' },
    { id: 'c17', name: 'Samuel Ofori', best: 'Mathematics', average: 73.2, about: 'Fast with mental arithmetic and always the first to finish the times table drills.' },
    { id: 'c18', name: 'Priscilla Nyame', best: 'Integrated Science', average: 72.8, about: 'Keeps the science notebooks for her group and waters the class plants.' },
    { id: 'c19', name: 'Daniel Ansah', best: 'ICT', average: 72.1, about: 'Helps the teacher set up the projector and the laptops before the ICT lessons.' },
    { id: 'c20', name: 'Comfort Adom', best: 'Ghanaian Language', average: 71.4, about: 'Cheerful and hard working. She helps the pupils who are still finding reading difficult.' },
    { id: 'c21', name: 'Isaac Kyei', best: 'Social Studies', average: 70.2, about: 'Plays the drums for school ceremonies and can name every region and its capital.' },
    { id: 'c22', name: 'Gloria Baah', best: 'French', average: 69.5, about: 'Improved a great deal in French this term. She practises the greetings with anyone who will listen.' },
  ],
  p5: [
    { id: 'c40', name: 'Ama Boatemaa', badge: 'Top of the class', best: 'English Language', average: 88.6, about: 'First in the class this term. She reads to the younger children at break time.' },
    { id: 'c41', name: 'Nana Yaw Addo', badge: 'Class prefect', best: 'Science', average: 86.2, about: 'Leads the line at assembly and hands out the reading books in the morning.' },
    { id: 'c42', name: 'Kwabena Nkrumah', badge: 'Sports captain', best: 'Creative Arts', average: 84.5, about: 'Captains the under nine football team and keeps the class in order after the whistle.' },
    { id: 'c43', name: 'Akua Mansa', best: 'Mathematics', average: 83.1, about: 'Very strong with numbers. She finishes her work early and checks the others.' },
    { id: 'c44', name: 'Yaw Ofori-Atta', best: 'Science', average: 82.4, about: 'Always asking how things work. He brought a model of a well for the science table.' },
    { id: 'c45', name: 'Adjoa Safo', best: 'English Language', average: 81.6, about: 'Reads with expression and takes part in the assembly performance every term.' },
    { id: 'c46', name: 'Kobina Edu', best: 'Mathematics', average: 79.8, about: 'Quick with his tables and proud of his neat handwriting.' },
    { id: 'c47', name: 'Abena Pokuaa', best: 'Our World Our People', average: 79.1, about: 'Knows the school rules better than most and gently reminds the others.' },
    { id: 'c48', name: 'Kofi Anane', best: 'Creative Arts', average: 78.4, about: 'Draws in every free minute. His pictures are pinned on the class wall.' },
    { id: 'c49', name: 'Ewurama Baiden', best: 'Creative Arts', average: 77.6, about: 'Sings in the assembly choir and is very kind to the new pupils.' },
    { id: 'c50', name: 'Kwame Adjei', best: 'ICT', average: 76.9, about: 'Helps carry the class laptop bag and is careful with the machines.' },
    { id: 'c51', name: 'Maame Serwaa Larbi', best: 'Ghanaian Language', average: 76.1, about: 'Knows a great many proverbs and tells stories well at the Friday reading circle.' },
    { id: 'c52', name: 'Nii Lante', best: 'Science', average: 75.4, about: 'Brings leaves and stones from home for the nature table.' },
    { id: 'c53', name: 'Efua Mensimah', best: 'English Language', average: 74.2, about: 'Reads aloud clearly and is never afraid to ask a question.' },
    { id: 'c54', name: 'Yaw Dickson', best: 'Mathematics', average: 73.5, about: 'Improving every week in mathematics and does his corrections without being told.' },
    { id: 'c55', name: 'Akosua Duah', best: 'Our World Our People', average: 72.6, about: 'Tidy, punctual and always ready with the register book.' },
    { id: 'c56', name: 'Selina Amankwah', best: 'Creative Arts', average: 71.8, about: 'Makes the class greetings cards for every occasion.' },
    { id: 'c57', name: 'Emmanuel Tetteh', best: 'ICT', average: 70.5, about: 'Keen on the computer lessons and helps the teacher switch off the machines at the end.' },
    { id: 'c58', name: 'Grace Nyarko', best: 'Ghanaian Language', average: 68.9, about: 'Quiet and hard working. She has improved her reading a great deal this term.' },
  ],
};

/** The average a ward is carrying, read off the subject scores. */
export function wardAverage(studentId: string): number {
  const profile = wardProfiles[studentId];
  if (!profile || !profile.subjects.length) return 0;
  const sum = profile.subjects.reduce((total, subject) => total + subject.score, 0);
  return Math.round((sum / profile.subjects.length) * 10) / 10;
}

export interface RosterEntry extends Classmate {
  /** True when this is one of the guardian's own children. */
  ward: boolean;
  /** Rank in the class, built from every average in the list. */
  rank: number;
}

/**
 * The whole class, the guardian's own children included and marked, sorted so
 * that rank 1 is the highest average. The rank a ward sees on their own page
 * comes from this same list, so the two can never disagree.
 */
export function classRoster(classId: string, wardNames: Record<string, string> = {}): RosterEntry[] {
  const peers = classmates[classId] ?? [];
  const wardEntries: Classmate[] = Object.entries(wardProfiles)
    .filter(([, profile]) => profile.classId === classId)
    .map(([id]) => ({
      id,
      name: wardNames[id] ?? `Pupil ${id}`,
      best: bestSubject(id)?.subject ?? '',
      about: '',
      average: wardAverage(id),
    }));

  return [...peers, ...wardEntries]
    .sort((one, other) => other.average - one.average)
    .map((student, index) => ({ ...student, ward: wardEntries.some(w => w.id === student.id), rank: index + 1 }));
}

/** The subject a ward scored highest in this term. */
export function bestSubject(studentId: string) {
  const subjects = wardProfiles[studentId]?.subjects ?? [];
  return subjects.reduce<SubjectResult | null>(
    (best, subject) => (!best || subject.score > best.score ? subject : best),
    null
  );
}

/** The subject a ward scored lowest in this term, which is the one to work on. */
export function weakestSubject(studentId: string) {
  const subjects = wardProfiles[studentId]?.subjects ?? [];
  return subjects.reduce<SubjectResult | null>(
    (worst, subject) => (!worst || subject.score < worst.score ? subject : worst),
    null
  );
}

/** Marks still to come back, and pieces of work with a date ahead of them. */
export function pendingWork(studentId: string) {
  return (wardProfiles[studentId]?.assessments ?? []).filter(work => work.due);
}

export function markedWork(studentId: string) {
  return (wardProfiles[studentId]?.assessments ?? []).filter(work => !work.due);
}

/** Attendance as a percentage of the days the school opened. */
export function attendanceRate(studentId: string): number {
  const record = wardProfiles[studentId]?.attendance;
  if (!record || !record.daysOpen) return 0;
  return Math.round(((record.present + record.late) / record.daysOpen) * 100);
}

export interface FeeSummary {
  charged: number;
  paid: number;
  balance: number;
}

/** Read off the fee lines rather than stored, so the totals cannot drift. */
export function feeSummary(studentId: string): FeeSummary {
  const lines = wardProfiles[studentId]?.fees.lines ?? [];
  return lines.reduce<FeeSummary>(
    (totals, line) => ({
      charged: totals.charged + line.charged,
      paid: totals.paid + line.paid,
      balance: totals.balance + (line.charged - line.paid),
    }),
    { charged: 0, paid: 0, balance: 0 }
  );
}

/** The rank and class size for a ward, taken from the class list. */
export function wardStanding(studentId: string, wardNames: Record<string, string> = {}) {
  const profile = wardProfiles[studentId];
  if (!profile) return { rank: 0, size: 0 };
  const roster = classRoster(profile.classId, wardNames);
  const me = roster.find(entry => entry.id === studentId);
  return { rank: me?.rank ?? 0, size: roster.length };
}

// ---------------------------------------------------------------------------
// Notices
// ---------------------------------------------------------------------------
export interface Notice {
  id: string;
  title: string;
  date: string;
  from: string;
  /** Who it is for, which is what the filter chips on the notices screen use. */
  audience: 'School' | 'Class' | 'Fees' | 'Teacher';
  classId?: string;
  body: string;
  pinned?: boolean;
}

export const notices: Notice[] = [
  {
    id: 'notice-1',
    title: 'Mid term break, 17 to 21 February',
    date: '2026-02-14',
    from: 'The School Office',
    audience: 'School',
    pinned: true,
    body:
      'School closes for the mid term break on Friday 17 February and reopens on Monday 24 February. Boarders may be collected from 12 noon on the Friday. The school bus will not run during the break.',
  },
  {
    id: 'notice-2',
    title: 'Fee balances to be cleared before the break',
    date: '2026-02-12',
    from: 'The Accounts Office',
    audience: 'Fees',
    pinned: true,
    body:
      'Parents with a balance on the current term are kindly asked to clear it before the mid term break. Payment may be made by mobile money to the school number or by transfer to the school account. Receipts are issued at the office and appear in this portal within a day.',
  },
  {
    id: 'notice-3',
    title: 'JHS 2 trip to the science museum',
    date: '2026-02-11',
    from: 'Madam Vivian Adjei',
    audience: 'Class',
    classId: 'jhs2',
    body:
      'The class will visit the science museum in Kumasi on Thursday 26 February, leaving at 7am and returning by 3pm. The cost is 50 cedis for transport and entry. A signed consent slip is required and both are due by Friday 21 February.',
  },
  {
    id: 'notice-4',
    title: 'Parents evening, Thursday 19 February',
    date: '2026-02-09',
    from: 'The School Office',
    audience: 'School',
    body:
      'Parents evening runs from 3pm to 6pm. Each parent has fifteen minutes with the form teacher and may see subject teachers in the hall. Please come with this term report, which you can read in this portal before you arrive.',
  },
  {
    id: 'notice-5',
    title: 'Extra French lessons on Thursdays',
    date: '2026-02-08',
    from: 'Madam Celine Adjoa',
    audience: 'Teacher',
    classId: 'jhs2',
    body:
      'French support classes now run every Thursday from 3pm to 4pm in Room 4. Any pupil who scored below 70 in the last test is expected to attend. There is no charge for these lessons.',
  },
  {
    id: 'notice-6',
    title: 'Vaccination day, Thursday 26 February',
    date: '2026-02-06',
    from: 'The School Nurse',
    audience: 'School',
    body:
      'The district health team will visit to give the measles and rubella vaccination. Please sign and return the consent form that was sent home with your child. Pupils without a signed form will not be vaccinated.',
  },
  {
    id: 'notice-7',
    title: 'Reading challenge for Primary 5',
    date: '2026-02-05',
    from: 'Madam Grace Antwi',
    audience: 'Class',
    classId: 'p5',
    body:
      'Every pupil in Primary 5 is challenged to read twenty books before the end of term. Books may be borrowed from the class box. Please write the title and the date in the reading card at the back of the exercise book.',
  },
  {
    id: 'notice-8',
    title: 'Sports day, Saturday 14 March',
    date: '2026-02-03',
    from: 'The Sports Department',
    audience: 'School',
    body:
      'Annual sports day will be held on the school field from 8am. Every pupil needs a house vest, shorts and trainers. Parents are welcome and there will be a parents race at midday. House colours are available at the school shop.',
  },
];

export function noticesFor(classId: string): Notice[] {
  return notices
    .filter(notice => !notice.classId || notice.classId === classId)
    .sort((one, other) => {
      if (!!one.pinned !== !!other.pinned) return one.pinned ? -1 : 1;
      return other.date.localeCompare(one.date);
    });
}

// ---------------------------------------------------------------------------
// Where to pay, and who to ring
// ---------------------------------------------------------------------------
export const paymentChannels = [
  { label: 'Mobile money', value: '024 123 4567', note: 'Reference: the pupil admission number' },
  { label: 'Bank transfer', value: 'Maple Grove International School', note: 'GCB Bank, Ayigya branch, account 1441000234567' },
  { label: 'At the office', value: 'Cash or cheque', note: 'Receipt issued on the spot, Monday to Friday, 8am to 4pm' },
];

/** Dates in this file are written for a reader, not for a machine. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatLongDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
