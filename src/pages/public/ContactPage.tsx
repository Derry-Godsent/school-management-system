import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { school } from '../../data';

const FIELD_CLASSES =
  'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]';
const LABEL_CLASSES = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contactDetails = [
    { icon: <MapPin size={18} />, label: 'Address', value: school.address },
    {
      icon: <Phone size={18} />,
      label: 'Phone',
      value: `${school.phone} / ${school.phoneAlt}`,
    },
    { icon: <Mail size={18} />, label: 'Email', value: school.email },
    {
      icon: <Clock size={18} />,
      label: 'Office Hours',
      value: 'Monday to Friday: 7:30 AM to 4:00 PM',
    },
  ];

  return (
    <div>
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">
              Contact
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">Get in Touch</h1>
            <p className="text-lg text-gray-600 mt-4">
              We would love to hear from you. Reach out for enquiries, visits or any questions.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactDetails.map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#E85D04]/10 rounded-lg flex items-center justify-center text-[#E85D04] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="text-gray-400 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm text-gray-500">{school.address}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
              {sent ? (
                <div className="p-8 bg-green-50 rounded-xl text-center" role="status">
                  <p className="text-green-800 font-medium">Message sent successfully!</p>
                  <p className="text-sm text-green-600 mt-2">We will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLASSES} htmlFor="contact-name">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        className={FIELD_CLASSES}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASSES} htmlFor="contact-phone">
                        Phone
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        className={FIELD_CLASSES}
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLASSES} htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className={FIELD_CLASSES}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASSES} htmlFor="contact-subject">
                      Subject
                    </label>
                    <select id="contact-subject" className={FIELD_CLASSES}>
                      <option>General Enquiry</option>
                      <option>Admissions</option>
                      <option>School Visit</option>
                      <option>Fees Information</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLASSES} htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      className={`${FIELD_CLASSES} resize-none`}
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
