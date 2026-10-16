import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { departments } from '../../data';

// Single source of truth for the class list offered at admission.
const APPLICABLE_CLASSES = departments.flatMap(dept => dept.levels);

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Submit Application',
    desc: 'Complete the online form below or collect a form from our admissions office.',
  },
  {
    step: '02',
    title: 'Assessment',
    desc: 'Your child will take a simple assessment to determine the appropriate class placement.',
  },
  {
    step: '03',
    title: 'Interview',
    desc: 'A brief meeting with parents and the child to discuss expectations and fit.',
  },
  {
    step: '04',
    title: 'Enrolment',
    desc: 'Upon acceptance, complete enrolment documentation and fee payment.',
  },
];

const REQUIREMENTS = [
  'Completed application form',
  'Birth certificate or passport of child',
  'Previous school report (if applicable)',
  'Passport photographs of child (2)',
  'Parent/guardian identification',
  'Immunisation records (for Early Years)',
];

const IMPORTANT_DATES = [
  { label: 'Applications Open', date: 'January 2026' },
  { label: 'Assessment Period', date: 'February - March 2026' },
  { label: 'Offers Released', date: 'April 2026' },
  { label: 'Enrolment Deadline', date: 'June 2026' },
  { label: 'School Opens', date: 'September 2026' },
];

const FIELD_CLASSES =
  'w-full px-4 py-3 border border-rule text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold';
const LABEL_CLASSES = 'block text-sm font-medium text-ink-mute mb-1.5';

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    childName: '',
    dob: '',
    applyingFor: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-16 pb-20 min-h-screen bg-cream">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl" aria-hidden="true">
              ✓
            </span>
          </div>
          <h2 className="text-2xl font-bold text-ink mb-3">Application Received</h2>
          <p className="text-ink-mute mb-6">
            Thank you for your interest in Maple Grove International School. Our admissions team
            will review your application and contact you within 5 working days.
          </p>
          <Link to="/" className="text-gold-deep font-medium text-sm hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="pt-16 pb-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-gold-deep font-medium text-sm uppercase tracking-wide">
              Admissions
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mt-3">
              Join Our School Family
            </h1>
            <p className="text-lg text-ink-mute mt-4 leading-relaxed">
              We welcome applications from families who share our commitment to academic excellence
              and character development.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ink mb-10">Admission Process</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map(item => (
              <div key={item.step} className="relative p-6 bg-cream">
                <span className="text-3xl font-bold text-gold-deep">{item.step}</span>
                <h4 className="font-semibold text-ink mt-2 mb-2">{item.title}</h4>
                <p className="text-sm text-ink-mute">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-ink mb-4">Entry Requirements</h3>
              <ul className="space-y-3">
                {REQUIREMENTS.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gold/10 flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 bg-gold" />
                    </div>
                    <span className="text-sm text-ink-mute">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink mb-4">Important Dates</h3>
              <div className="space-y-4">
                {IMPORTANT_DATES.map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3 border-b border-rule"
                  >
                    <span className="text-sm text-ink-mute">{item.label}</span>
                    <span className="text-sm font-medium text-ink">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-paper" id="apply">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-ink mb-2">Online Application</h2>
          <p className="text-ink-mute mb-8">
            Fill in the form below to start the admission process.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASSES} htmlFor="childName">
                  Child&apos;s Full Name *
                </label>
                <input
                  id="childName"
                  type="text"
                  required
                  value={formData.childName}
                  onChange={e => setFormData({ ...formData, childName: e.target.value })}
                  className={FIELD_CLASSES}
                  placeholder="e.g. Kwame Mensah"
                />
              </div>
              <div>
                <label className={LABEL_CLASSES} htmlFor="dob">
                  Date of Birth *
                </label>
                <input
                  id="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className={FIELD_CLASSES}
                />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASSES} htmlFor="applyingFor">
                Applying For *
              </label>
              <select
                id="applyingFor"
                required
                value={formData.applyingFor}
                onChange={e => setFormData({ ...formData, applyingFor: e.target.value })}
                className={FIELD_CLASSES}
              >
                <option value="">Select a class</option>
                {APPLICABLE_CLASSES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-t pt-6">
              <h4 className="font-medium text-ink mb-4">Parent/Guardian Information</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASSES} htmlFor="parentName">
                    Full Name *
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                    className={FIELD_CLASSES}
                    placeholder="Parent/Guardian name"
                  />
                </div>
                <div>
                  <label className={LABEL_CLASSES} htmlFor="parentPhone">
                    Phone Number *
                  </label>
                  <input
                    id="parentPhone"
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                    className={FIELD_CLASSES}
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className={LABEL_CLASSES} htmlFor="parentEmail">
                  Email Address
                </label>
                <input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={e => setFormData({ ...formData, parentEmail: e.target.value })}
                  className={FIELD_CLASSES}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASSES} htmlFor="notes">
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className={`${FIELD_CLASSES} resize-none`}
                placeholder="Any additional information you would like to share..."
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold text-ink font-medium hover:bg-gold-pale transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
