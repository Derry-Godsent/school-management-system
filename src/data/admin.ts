/**
 * The staff console's data.
 *
 * The parent app is the read side of this school. This is the write side: the
 * six people who keep it true. Everything a parent sees on their phone starts
 * here, so the numbers on these screens are the same numbers the parent app
 * shows, read from the same records.
 *
 * Six roles, taken from how real school systems divide the work:
 *
 *   director  the school's head of everything, sees and approves all of it
 *   head      the academic head, runs teaching, results and staff
 *   admin     the registrar, runs admissions, pupil records and the office
 *   finance   the bursar, runs billing, receipts and arrears
 *   form      a form teacher, runs one class: register, remarks, class notices
 *   subject   a subject teacher, owns one subject's gradebook
 *
 * A role never sees a module it has no business in. The permissions table
 * below is the single place that decides that, and both the navigation and the
 * screens read from it, so a hidden module is also an unreachable one.
 *
 * Demonstration data. Seeded values are stamped in the module doc rather than
 * written by hand, so they stay put between renders.
 */

import { students, guardians, feeRecords, academicYear } from './index';
import { classInfo, classRoster, type RosterEntry, notices, noticesFor, wardAverage } from './portal';

/** The day the showcase is set in, the middle of the second term. */
export const DEMO_TODAY = '2026-02-18';

// ---------------------------------------------------------------------------
// Roles and permissions
// ---------------------------------------------------------------------------
export type RoleId = 'director' | 'head' | 'admin' | 'finance' | 'form' | 'subject';

export type ModuleId =
  | 'overview'
  | 'admissions'
  | 'students'
  | 'staff'
  | 'classes'
  | 'attendance'
  | 'academics'
  | 'finance'
  | 'communications'
  | 'reports'
  | 'access'
  | 'settings';

export type Access = 'edit' | 'view' | 'none';

export interface Role {
  id: RoleId;
  /** What the role is called on the sign in screen. */
  title: string;
  /** The person holding it in this demonstration. */
  name: string;
  email: string;
  password: string;
  /** One line, in plain words, about what the role does all day. */
  blurb: string;
  /** The three things they touch most, shown on the sign in card. */
  focuses: string[];
  tone: 'orange' | 'green' | 'purple' | 'yellow' | 'plain';
}

export const roles: Role[] = [
  {
    id: 'director',
    title: 'School Director',
    name: 'Mr. Kwame Asante',
    email: 'director@maplegrove.edu.gh',
    password: 'demo123',
    blurb: 'Sees the whole school and signs off what leaves it.',
    focuses: ['Whole school picture', 'Approvals', 'Finance oversight'],
    tone: 'orange',
  },
  {
    id: 'head',
    title: 'Head Teacher',
    name: 'Madam Elizabeth Osei',
    email: 'head@maplegrove.edu.gh',
    password: 'demo123',
    blurb: 'Runs the teaching: results, staff and the standard of work.',
    focuses: ['Results to publish', 'Staff and classes', 'Attendance'],
    tone: 'purple',
  },
  {
    id: 'admin',
    title: 'School Administrator',
    name: 'Mrs. Gifty Amponsah',
    email: 'admin@maplegrove.edu.gh',
    password: 'demo123',
    blurb: 'Keeps the records straight, from admission to the last form.',
    focuses: ['Admissions', 'Pupil records', 'Notices'],
    tone: 'green',
  },
  {
    id: 'finance',
    title: 'Finance Officer',
    name: 'Mr. Daniel Asare',
    email: 'finance@maplegrove.edu.gh',
    password: 'demo123',
    blurb: 'Bills, receipts and follows up what is still owed.',
    focuses: ['Fee bills', 'Payments', 'Arrears'],
    tone: 'yellow',
  },
  {
    id: 'form',
    title: 'Form Teacher',
    name: 'Madam Vivian Adjei',
    email: 'form@maplegrove.edu.gh',
    password: 'demo123',
    blurb: 'One class, every day: the register and the term remark.',
    focuses: ['JHS 2 register', 'Class remarks', 'Class notices'],
    tone: 'green',
  },
  {
    id: 'subject',
    title: 'Subject Teacher',
    name: 'Mr. Seth Owusu',
    email: 'teacher@maplegrove.edu.gh',
    password: 'demo123',
    blurb: 'Owns one subject, from the assignment to the mark.',
    focuses: ['Mathematics', 'Assignments', 'Marks'],
    tone: 'purple',
  },
];

/**
 * The permission table. `edit` means the role may change the record, `view` means
 * it may read it and nothing more, and a missing entry means the module does not
 * exist for that person.
 */
export const permissions: Record<RoleId, Partial<Record<ModuleId, Access>>> = {
  director: {
    overview: 'view', admissions: 'edit', students: 'edit', staff: 'edit', classes: 'edit',
    attendance: 'view', academics: 'view', finance: 'view', communications: 'edit',
    reports: 'view', access: 'edit', settings: 'edit',
  },
  head: {
    overview: 'view', students: 'view', staff: 'edit', classes: 'edit', attendance: 'view',
    academics: 'edit', communications: 'edit', reports: 'view',
  },
  admin: {
    overview: 'view', admissions: 'edit', students: 'edit', staff: 'view', classes: 'edit',
    attendance: 'edit', communications: 'edit', reports: 'view', settings: 'edit',
  },
  finance: {
    overview: 'view', students: 'view', finance: 'edit', communications: 'edit', reports: 'view',
  },
  form: {
    overview: 'view', students: 'view', classes: 'edit', attendance: 'edit', academics: 'view',
    communications: 'edit',
  },
  subject: {
    overview: 'view', students: 'view', academics: 'edit', communications: 'edit',
  },
};

export function accessOf(role: RoleId, module: ModuleId): Access {
  return permissions[role][module] ?? 'none';
}

export function can(role: RoleId, module: ModuleId, need: Access = 'view'): boolean {
  const held = accessOf(role, module);
  if (held === 'none') return false;
  return need === 'view' ? true : held === 'edit';
}

export interface ModuleMeta {
  id: ModuleId;
  label: string;
  short: string;
  group: 'School' | 'Academic' | 'Office';
}

/** The navigation, in the order a school day runs. */
export const modules: ModuleMeta[] = [
  { id: 'overview', label: 'Overview', short: 'Today at a glance', group: 'School' },
  { id: 'admissions', label: 'Admissions', short: 'Applications and enrolment', group: 'Office' },
  { id: 'students', label: 'Pupils', short: 'Every pupil on roll', group: 'School' },
  { id: 'staff', label: 'Staff', short: 'People and their access', group: 'School' },
  { id: 'classes', label: 'Classes', short: 'Who teaches what, and when', group: 'Academic' },
  { id: 'attendance', label: 'Register', short: 'Today, class by class', group: 'Academic' },
  { id: 'academics', label: 'Results', short: 'Marks, and publishing them', group: 'Academic' },
  { id: 'finance', label: 'Finance', short: 'Bills, receipts and arrears', group: 'Office' },
  { id: 'communications', label: 'Notices', short: 'What goes to the app', group: 'Office' },
  { id: 'reports', label: 'Reports', short: 'The term, in numbers', group: 'School' },
  { id: 'access', label: 'Access', short: 'Who may do what', group: 'Office' },
  { id: 'settings', label: 'Settings', short: 'The school year', group: 'Office' },
];

// ---------------------------------------------------------------------------
// Classes and their people
// ---------------------------------------------------------------------------
export const CLASS_IDS = ['jhs2', 'p5'] as const;

export const classSummary = CLASS_IDS.map(classId => {
  const info = classInfo[classId];
  const roster = classRoster(classId);
  return {
    id: classId,
    name: info.name,
    room: info.room,
    formTeacher: info.formTeacher,
    subjects: info.subjectTeachers.length + 1,
    pupils: roster.length,
    presentToday: info.presentToday,
    termAttendance: info.termAttendance,
    average: Math.round((roster.reduce((total, entry) => total + entry.average, 0) / roster.length) * 10) / 10,
  };
});

// ---------------------------------------------------------------------------
// What each person is assigned to
// ---------------------------------------------------------------------------

/**
 * A teacher does not work on the whole school.
 *
 * A form teacher has one class: the one whose register they take and whose
 * term remarks they write. A subject teacher has one subject in one class, or
 * a handful of classes if they are senior, and not one pupil or mark outside
 * that. Only the office roles work across the school, because that is the job.
 *
 * Every screen reads its scope from here rather than from a class picker, so a
 * teacher cannot wander into another class by using the interface, and the
 * figures they see are their own pupils rather than a school average they have
 * no power over.
 */
export interface Scope {
  kind: 'school' | 'class' | 'subject';
  classIds: string[];
  /** The subject pairs this person may mark. Empty for a form teacher. */
  subjects: { classId: string; subject: string; outOf: number }[];
  /** The line shown under their name in the rail. */
  label: string;
  detail: string;
}

const SCHOOL: Scope = {
  kind: 'school',
  classIds: ['jhs2', 'p5'],
  subjects: [],
  label: 'Whole school',
  detail: 'Every class, every record',
};

export const scopeByRole: Record<RoleId, Scope> = {
  director: SCHOOL,
  head: { ...SCHOOL, label: 'Whole school', detail: 'Academic oversight' },
  admin: { ...SCHOOL, label: 'Whole school', detail: 'Records and office' },
  finance: { ...SCHOOL, label: 'Whole school', detail: 'Billing and receipts' },
  form: {
    kind: 'class',
    classIds: ['jhs2'],
    subjects: [],
    label: 'JHS 2',
    detail: 'Form teacher, one class',
  },
  subject: {
    kind: 'subject',
    classIds: ['jhs2'],
    subjects: [{ classId: 'jhs2', subject: 'Mathematics', outOf: 24 }],
    label: 'Mathematics, JHS 2',
    detail: 'Subject teacher, one class',
  },
};

export function scopeFor(role: RoleId): Scope {
  return scopeByRole[role];
}

/** The classes this person may open. */
export function classesInScope(role: RoleId) {
  const scope = scopeFor(role);
  return classSummary.filter(klass => scope.classIds.includes(klass.id));
}

/** The pupils this person may see. */
export function pupilsInScope(role: RoleId) {
  const scope = scopeFor(role);
  return rollWithFees.filter(pupil => scope.classIds.includes(pupil.classId));
}

/** The subjects this person may mark, with the class they belong to. */
export function subjectsInScope(role: RoleId) {
  return scopeFor(role).subjects;
}

export function mayTeach(role: RoleId, classId: string): boolean {
  return scopeFor(role).classIds.includes(classId);
}

/** The department a role sits in, which is what the rail is grouped by. */
export interface Department {
  id: 'leadership' | 'academic' | 'administration' | 'finance';
  name: string;
  /** What this department is responsible for, in one line. */
  remit: string;
}

export const departmentOf: Record<RoleId, Department> = {
  director: { id: 'leadership', name: 'Leadership', remit: 'The whole school, and what leaves it' },
  head: { id: 'academic', name: 'Academic', remit: 'Teaching, results and the standard of work' },
  form: { id: 'academic', name: 'Academic', remit: 'One class, every day' },
  subject: { id: 'academic', name: 'Academic', remit: 'One subject, marked properly' },
  admin: { id: 'administration', name: 'Administration', remit: 'Records, admissions and the office' },
  finance: { id: 'finance', name: 'Bursary', remit: 'Bills, receipts and what is owed' },
};

// ---------------------------------------------------------------------------
// Guardian and fee details for every pupil on roll
// ---------------------------------------------------------------------------

/** A small deterministic number from a string, so seeded values never move. */
function seed(text: string): number {
  let hash = 0;
  for (const character of text) hash = (hash * 31 + character.charCodeAt(0)) % 9973;
  return hash;
}

const peerGuardianSurnames = ['Frimpong', 'Owusu', 'Agyeman', 'Antwi', 'Boateng', 'Boakye', 'Danso', 'Nyarko'];

export interface PupilRecord {
  id: string;
  name: string;
  admissionNo: string;
  classId: string;
  className: string;
  house: string;
  gender: string;
  guardianName: string;
  guardianPhone: string;
  average: number;
  rank: number;
  size: number;
  attendance: number;
  feeBalance: number;
  /** Set when this pupil is one of the three the parent app knows about. */
  ward: boolean;
  /** The class duty, where they hold one. */
  duty?: string;
}

function admissionNumber(index: number): string {
  return `MG/2024/${String(index + 1).padStart(3, '0')}`;
}

/**
 * The roll, built from the same class lists the parent app reads, so a pupil
 * shown here is the same pupil, with the same rank and the same average.
 */
export const roll: PupilRecord[] = CLASS_IDS.flatMap(classId => {
  const roster = classRoster(classId);
  return roster.map((entry, index) => {
    const ward = students.find(student => student.id === entry.id);
    const guardian = ward ? guardians.find(person => person.id === ward.guardianId) : undefined;
    const digest = seed(entry.id + classId);
    return {
      id: entry.id,
      name: entry.name,
      admissionNo: ward?.studentId ?? admissionNumber(digest % 900),
      classId,
      className: classInfo[classId].name,
      house: ward?.house ?? ['Eagles', 'Doves', 'Hawks', 'Lions'][digest % 4],
      gender: ward?.gender ?? (entry.name.includes('Ama') || entry.name.endsWith('a') ? 'Female' : 'Male'),
      guardianName: guardian?.name ?? `Mr. & Mrs. ${peerGuardianSurnames[digest % peerGuardianSurnames.length]}`,
      guardianPhone: guardian?.phone ?? `+233 ${20 + (digest % 7)} ${100 + (digest % 899)} ${1000 + (digest % 8999)}`,
      average: entry.average,
      rank: entry.rank,
      size: roster.length,
      attendance: ward ? 90 + (digest % 9) : [88, 91, 93, 95, 96, 97, 98, 99][digest % 8],
      feeBalance: ward ? 0 : [0, 0, 0, 0, 350, 500, 750, 950, 1200][digest % 9],
      ward: entry.ward,
      duty: entry.badge,
    } satisfies PupilRecord;
  });
});

/** Wards carry their real balances, read off the fee lines the parent app shows. */
export const rollWithFees: PupilRecord[] = roll.map(pupil => {
  if (!pupil.ward) return pupil;
  const lines = feeRecords.filter(record => record.studentId === pupil.id);
  const balance = lines.reduce((total, line) => total + line.balance, 0);
  return { ...pupil, feeBalance: balance };
});

export const rollSize = rollWithFees.length;

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------
export const billedThisTerm =
  rollWithFees.reduce((total, pupil) => total + 5600, 0) - 3 * 0;

export const feePosition = (() => {
  const billed = rollWithFees.reduce((total, pupil) => total + 5600, 0);
  const outstanding = rollWithFees.reduce((total, pupil) => total + pupil.feeBalance, 0);
  const collected = billed - outstanding;
  return {
    billed,
    collected,
    outstanding,
    rate: Math.round((collected / billed) * 100),
    arrears: rollWithFees.filter(pupil => pupil.feeBalance > 0).length,
    cleared: rollWithFees.filter(pupil => pupil.feeBalance === 0).length,
  };
})();

export interface CategoryLine {
  category: string;
  billed: number;
  collected: number;
}

export const feeByCategory: CategoryLine[] = [
  { category: 'Tuition', billed: 174000, collected: 158400 },
  { category: 'Feeding', billed: 52000, collected: 47500 },
  { category: 'Transport', billed: 31000, collected: 24400 },
  { category: 'ICT and examination', billed: 23000, collected: 21500 },
  { category: 'Books and stationery', billed: 12000, collected: 9900 },
];

export const recentPayments = [
  { id: 'RCP-2026-140', pupil: 'Akosua Frimpong', className: 'JHS 2', amount: 950, method: 'Mobile Money', time: 'Today, 9:12am', receivedBy: 'Daniel Asare' },
  { id: 'RCP-2026-139', pupil: 'Kofi Anane', className: 'Primary 5', amount: 1200, method: 'Bank transfer', time: 'Today, 8:47am', receivedBy: 'Daniel Asare' },
  { id: 'RCP-2026-138', pupil: 'Kwame Mensah', className: 'JHS 2', amount: 300, method: 'Mobile Money', time: 'Yesterday, 3:20pm', receivedBy: 'Gifty Amponsah' },
  { id: 'RCP-2026-137', pupil: 'Adjoa Safo', className: 'Primary 5', amount: 500, method: 'Cash at the office', time: 'Yesterday, 1:05pm', receivedBy: 'Daniel Asare' },
];

// ---------------------------------------------------------------------------
// Attendance today
// ---------------------------------------------------------------------------
export const attendanceToday = classSummary.map(klass => ({
  ...klass,
  absent: klass.pupils - klass.presentToday,
  rate: Math.round((klass.presentToday / klass.pupils) * 100),
}));

/** The register, class by class, for the form teacher to work through. */
export function registerFor(classId: string) {
  return rollWithFees
    .filter(pupil => pupil.classId === classId)
    .map((pupil, index) => ({
      ...pupil,
      today:
        pupil.id === '1' ? 'present' : pupil.id === '3' ? 'absent' : index % 11 === 4 ? 'late' : 'present',
    }));
}

// ---------------------------------------------------------------------------
// Marks and what is waiting to be published
// ---------------------------------------------------------------------------
export interface Publishable {
  classId: string;
  className: string;
  subject: string;
  teacher: string;
  marked: number;
  outOf: number;
  average: number;
  status: 'Ready' | 'Draft' | 'Published';
}

export const resultBatches: Publishable[] = [
  { classId: 'jhs2', className: 'JHS 2', subject: 'Mathematics', teacher: 'Mr. Seth Owusu', marked: 24, outOf: 24, average: 68, status: 'Ready' },
  { classId: 'jhs2', className: 'JHS 2', subject: 'English Language', teacher: 'Madam Rebecca Danso', marked: 24, outOf: 24, average: 65, status: 'Ready' },
  { classId: 'jhs2', className: 'JHS 2', subject: 'Integrated Science', teacher: 'Mr. Bright Kusi', marked: 21, outOf: 24, average: 66, status: 'Draft' },
  { classId: 'jhs2', className: 'JHS 2', subject: 'French', teacher: 'Madam Celine Adjoa', marked: 24, outOf: 24, average: 62, status: 'Published' },
  { classId: 'p5', className: 'Primary 5', subject: 'Mathematics', teacher: 'Mr. Isaac Larbi', marked: 19, outOf: 19, average: 71, status: 'Ready' },
  { classId: 'p5', className: 'Primary 5', subject: 'Science', teacher: 'Mr. Kofi Badu', marked: 19, outOf: 19, average: 72, status: 'Published' },
  { classId: 'p5', className: 'Primary 5', subject: 'Creative Arts', teacher: 'Madam Doris Appiah', marked: 14, outOf: 19, average: 76, status: 'Draft' },
];

export const readyToPublish = resultBatches.filter(batch => batch.status === 'Ready');

// ---------------------------------------------------------------------------
// Admissions
// ---------------------------------------------------------------------------
export const admissionQueue = [
  { id: 'app-001', child: 'Adwoa Boateng', applyingFor: 'KG 2', parent: 'Mrs. Yaa Boateng', phone: '+233 24 888 9900', received: '2026-02-16', stage: 'New', note: 'Sibling of a pupil in Primary 3.' },
  { id: 'app-002', child: 'Kwame Asare', applyingFor: 'Primary 2', parent: 'Mr. Ebo Asare', phone: '+233 20 777 1122', received: '2026-02-15', stage: 'New', note: 'Transfer from Kumasi Anglican.' },
  { id: 'app-003', child: 'Abena Nhyira', applyingFor: 'JHS 1', parent: 'Mrs. Akua Nhyira', phone: '+233 27 555 4433', received: '2026-02-14', stage: 'Interview', note: 'Entrance test booked for 21 February.' },
  { id: 'app-004', child: 'Yaw Oduro', applyingFor: 'KG 1', parent: 'Mr. Kofi Oduro', phone: '+233 24 321 7788', received: '2026-02-12', stage: 'Interview', note: 'Needs the school bus, Asokwa route.' },
  { id: 'app-005', child: 'Efua Mensah', applyingFor: 'Primary 4', parent: 'Dr. Ama Mensah', phone: '+233 20 909 3344', received: '2026-02-11', stage: 'Offer', note: 'Offer sent, waiting on acceptance.' },
  { id: 'app-006', child: 'Kojo Baffour', applyingFor: 'JHS 2', parent: 'Mr. Yaw Baffour', phone: '+233 27 123 5566', received: '2026-02-09', stage: 'Offer', note: 'Offer accepted, fees to be billed.' },
];

export const admissionStages = ['New', 'Interview', 'Offer', 'Enrolled'] as const;

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  classes: string;
  status: 'In school' | 'On leave' | 'Off campus';
}

export const staffRoster: StaffMember[] = [
  { id: 'st-1', name: 'Mr. Kwame Asante', role: 'School Director', department: 'Administration', email: 'k.asante@maplegrove.edu.gh', phone: '+233 24 111 2233', classes: 'Whole school', status: 'In school' },
  { id: 'st-2', name: 'Madam Elizabeth Osei', role: 'Head Teacher', department: 'Academic', email: 'e.osei@maplegrove.edu.gh', phone: '+233 24 111 2244', classes: 'Whole school', status: 'In school' },
  { id: 'st-3', name: 'Mrs. Gifty Amponsah', role: 'School Administrator', department: 'Administration', email: 'g.amponsah@maplegrove.edu.gh', phone: '+233 20 222 3311', classes: 'Office', status: 'In school' },
  { id: 'st-4', name: 'Mr. Daniel Asare', role: 'Finance Officer', department: 'Finance', email: 'd.asare@maplegrove.edu.gh', phone: '+233 27 333 4411', classes: 'Office', status: 'In school' },
  { id: 'st-5', name: 'Madam Vivian Adjei', role: 'Form Teacher', department: 'Junior High', email: 'v.adjei@maplegrove.edu.gh', phone: '+233 24 333 4455', classes: 'JHS 2', status: 'In school' },
  { id: 'st-6', name: 'Mr. Seth Owusu', role: 'Subject Teacher', department: 'Mathematics', email: 's.owusu@maplegrove.edu.gh', phone: '+233 20 111 2233', classes: 'JHS 2', status: 'In school' },
  { id: 'st-7', name: 'Madam Rebecca Danso', role: 'Subject Teacher', department: 'Languages', email: 'r.danso@maplegrove.edu.gh', phone: '+233 24 222 3344', classes: 'JHS 2', status: 'On leave' },
  { id: 'st-8', name: 'Mr. Bright Kusi', role: 'Subject Teacher', department: 'Science', email: 'b.kusi@maplegrove.edu.gh', phone: '+233 20 333 4455', classes: 'JHS 2', status: 'Off campus' },
  { id: 'st-9', name: 'Madam Grace Antwi', role: 'Form Teacher', department: 'Primary', email: 'g.antwi@maplegrove.edu.gh', phone: '+233 24 123 9876', classes: 'Primary 5', status: 'In school' },
  { id: 'st-10', name: 'Mr. Isaac Larbi', role: 'Subject Teacher', department: 'Mathematics', email: 'i.larbi@maplegrove.edu.gh', phone: '+233 20 234 5678', classes: 'Primary 5', status: 'In school' },
];

// ---------------------------------------------------------------------------
// The activity feed: every row is a change that reached a parent's phone
// ---------------------------------------------------------------------------
export interface ActivityItem {
  id: string;
  who: string;
  role: RoleId;
  what: string;
  /** How many families the change reached. */
  reached: number;
  when: string;
  module: ModuleId;
}

export const activity: ActivityItem[] = [
  { id: 'a1', who: 'Madam Vivian Adjei', role: 'form', what: 'marked the JHS 2 register', reached: 24, when: '6 minutes ago', module: 'attendance' },
  { id: 'a2', who: 'Mr. Daniel Asare', role: 'finance', what: 'recorded a payment of GHS 950', reached: 1, when: '21 minutes ago', module: 'finance' },
  { id: 'a3', who: 'Mr. Seth Owusu', role: 'subject', what: 'published the mathematics test', reached: 24, when: '48 minutes ago', module: 'academics' },
  { id: 'a4', who: 'Mrs. Gifty Amponsah', role: 'admin', what: 'sent a notice about the break', reached: 46, when: '2 hours ago', module: 'communications' },
  { id: 'a5', who: 'Madam Grace Antwi', role: 'form', what: 'wrote the term remark for Primary 5', reached: 19, when: 'Yesterday, 3:40pm', module: 'academics' },
  { id: 'a6', who: 'Mr. Daniel Asare', role: 'finance', what: 'billed the second instalment', reached: 46, when: 'Yesterday, 9:02am', module: 'finance' },
];

// ---------------------------------------------------------------------------
// What is waiting on this person, given their role
// ---------------------------------------------------------------------------
export interface Task {
  id: string;
  label: string;
  detail: string;
  module: ModuleId;
  tone: 'orange' | 'green' | 'purple' | 'yellow';
  count: number;
}

export function tasksFor(role: RoleId): Task[] {
  const shared: Task[] = [
    { id: 't1', label: 'Notices to send', detail: 'Two drafts are waiting', module: 'communications', tone: 'orange', count: 2 },
  ];
  if (role === 'director' || role === 'head') {
    return [
      { id: 't2', label: 'Results to approve', detail: `${readyToPublish.length} subjects are marked and ready`, module: 'academics', tone: 'purple', count: readyToPublish.length },
      { id: 't3', label: 'Admissions to decide', detail: 'Four applications this week', module: 'admissions', tone: 'green', count: 4 },
      ...shared,
    ];
  }
  if (role === 'admin') {
    return [
      { id: 't4', label: 'Applications to process', detail: 'Two new, two in interview', module: 'admissions', tone: 'green', count: 4 },
      { id: 't5', label: 'Pupil records to finish', detail: 'Three missing guardian numbers', module: 'students', tone: 'orange', count: 3 },
      ...shared,
    ];
  }
  if (role === 'finance') {
    return [
      { id: 't6', label: 'Arrears to follow up', detail: `${feePosition.arrears} pupils still owe fees`, module: 'finance', tone: 'yellow', count: feePosition.arrears },
      { id: 't7', label: 'Receipts to reconcile', detail: 'Four payments since yesterday', module: 'finance', tone: 'green', count: 4 },
      ...shared,
    ];
  }
  if (role === 'form') {
    return [
      { id: 't8', label: 'Register not finished', detail: 'JHS 2, afternoon session', module: 'attendance', tone: 'green', count: 1 },
      { id: 't9', label: 'Remarks to write', detail: 'Three pupils have no term remark', module: 'academics', tone: 'purple', count: 3 },
      ...shared,
    ];
  }
  return [
    { id: 't10', label: 'Marks to enter', detail: 'Integrated Science, 21 of 24', module: 'academics', tone: 'purple', count: 3 },
    { id: 't11', label: 'Assignments due back', detail: 'Angles and bearings test', module: 'academics', tone: 'orange', count: 1 },
    { id: 't12', label: 'Class notice', detail: 'French support, Thursdays', module: 'communications', tone: 'green', count: 1 },
  ];
}

// ---------------------------------------------------------------------------
// The school's headline figures
// ---------------------------------------------------------------------------
export const schoolKpis = [
  { label: 'Pupils on roll', value: rollSize, note: 'Across 2 classes in this demo', module: 'students' as ModuleId },
  { label: 'Present today', value: attendanceToday.reduce((total, klass) => total + klass.presentToday, 0), note: `${Math.round((attendanceToday.reduce((total, klass) => total + klass.presentToday, 0) / rollSize) * 100)} per cent of the roll`, module: 'attendance' as ModuleId },
  { label: 'Fees collected', value: feePosition.rate, suffix: '%', note: `${feePosition.arrears} pupils still owe`, module: 'finance' as ModuleId },
  { label: 'Results waiting', value: readyToPublish.length, note: 'Marked, not yet published', module: 'academics' as ModuleId },
];

export const termWeeks = (() => {
  const term = academicYear.terms[1];
  const start = new Date(term.start);
  const today = new Date(DEMO_TODAY);
  const days = Math.round((today.getTime() - start.getTime()) / 86400000);
  return { week: Math.max(1, Math.ceil(days / 7)), of: 12, term: term.name };
})();

/** Every notice that exists, newest first, for the communications screen. */
export const allNotices = [...notices].sort((one, other) => other.date.localeCompare(one.date));

export { classInfo, notices, noticesFor, wardAverage };
export type { RosterEntry };
