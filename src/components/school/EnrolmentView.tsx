import React, { useState } from 'react';
import { CheckCircle2, GraduationCap, LogIn, Mail, Send } from 'lucide-react';
import { User } from 'firebase/auth';
import { submitContactMessage } from '../../lib/supabase';
import { submitSchoolEnrolment } from '../../utils/schoolFirebaseService';
import { SchoolThemeTokens } from './schoolTheme';

interface EnrolmentViewProps {
  theme: SchoolThemeTokens;
  user: User | null;
  onSignIn: () => void;
}

export const EnrolmentView: React.FC<EnrolmentViewProps> = ({ theme, user, onSignIn }) => {
  const [studentName, setStudentName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [country, setCountry] = useState<string>('India');
  const [currentProficiency, setCurrentProficiency] = useState<string>('Complete Beginner (A0)');
  const [preferredCourse, setPreferredCourse] = useState<string>(
    'Comprehensive Russian Programme (A0 – B2)'
  );
  const [learningGoals, setLearningGoals] = useState<string>(
    'Preparing for Russian university study / cultural fluency'
  );
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !email.trim() || !learningGoals.trim()) {
      setStatus('error');
      setFeedback('Please enter your name, email address, and learning goals.');
      return;
    }

    setStatus('submitting');
    try {
      if (user && user.emailVerified) {
        await submitSchoolEnrolment(user, {
          studentName,
          email,
          country,
          currentProficiency,
          preferredCourse,
          learningGoals,
          message,
        });
        setStatus('success');
        setFeedback(
          'Your enrolment request has been recorded in the School portal! Teacher Sarika Kumari will review it in the Faculty Panel.'
        );
      } else {
        const res = await submitContactMessage({
          name: studentName.trim(),
          email: email.trim(),
          subject: `Russian School Enrolment (${currentProficiency}) — ${preferredCourse}`,
          message: `Country: ${country}\nGoals: ${learningGoals}\nMessage: ${message}`,
        });
        if (!res.success) {
          setStatus('error');
          setFeedback(
            res.error ||
              'Please sign in with Google above or email sarikakumari10500@gmail.com directly.'
          );
          return;
        }
        setStatus('success');
        setFeedback(
          'Enrolment inquiry received! Sign in with Google anytime to link it with your student progress dashboard.'
        );
      }
      setMessage('');
    } catch (err: unknown) {
      setStatus('error');
      setFeedback(err instanceof Error ? err.message : 'Unable to submit form right now.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 space-y-5 ${theme.cardBg}`}>
        <div className="space-y-1">
          <span className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
            Admissions & Study Registration
          </span>
          <h2 className={`font-cinzel text-2xl sm:text-3xl font-bold ${theme.heading}`}>
            Enrol in School of Foreign Languages – Russian
          </h2>
          <p className={`text-xs sm:text-sm ${theme.text}`}>
            Register your level and study goals so instructor Sarika Kumari can guide your module
            placement and review written assignments.
          </p>
        </div>

        {!user && (
          <div className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${theme.subCardBg}`}>
            <div className="text-xs space-y-0.5">
              <div className={`font-bold ${theme.heading}`}>Recommended: Sign In First</div>
              <div className={theme.muted}>
                Signing in with Google attaches your enrolment directly to your Student Dashboard and Certificate record.
              </div>
            </div>
            <button
              type="button"
              onClick={onSignIn}
              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shrink-0 cursor-pointer ${theme.primaryBtn}`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Google Sign In</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1 text-xs">
              <span className={`font-semibold ${theme.heading}`}>Full Name *</span>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm ${theme.inputCls}`}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className={`font-semibold ${theme.heading}`}>Email Address *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm ${theme.inputCls}`}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1 text-xs">
              <span className={`font-semibold ${theme.heading}`}>Country</span>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm ${theme.inputCls}`}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className={`font-semibold ${theme.heading}`}>Current Russian Proficiency</span>
              <select
                value={currentProficiency}
                onChange={(e) => setCurrentProficiency(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm ${theme.inputCls}`}
              >
                <option>Complete Beginner (A0)</option>
                <option>Know Cyrillic Script Only (A0+)</option>
                <option>Elementary (A1)</option>
                <option>Basic Conversational (A2)</option>
                <option>Intermediate (B1)</option>
                <option>Upper Intermediate (B2+)</option>
              </select>
            </label>
          </div>

          <label className="block space-y-1 text-xs">
            <span className={`font-semibold ${theme.heading}`}>Preferred Course Track</span>
            <select
              value={preferredCourse}
              onChange={(e) => setPreferredCourse(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm ${theme.inputCls}`}
            >
              <option>Comprehensive Russian Programme (A0 – B2)</option>
              <option>Level 0 Alphabet & Pronunciation Intensive</option>
              <option>Russian for Life & University Study in Russia</option>
              <option>Russian Literature & Cultural Bridge Track (B1–C2)</option>
            </select>
          </label>

          <label className="block space-y-1 text-xs">
            <span className={`font-semibold ${theme.heading}`}>Study Goals *</span>
            <input
              type="text"
              required
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm ${theme.inputCls}`}
            />
          </label>

          <label className="block space-y-1 text-xs">
            <span className={`font-semibold ${theme.heading}`}>Additional Questions or Notes</span>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share target university, city, or preferred schedule..."
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm ${theme.inputCls}`}
            />
          </label>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer disabled:opacity-45 ${theme.primaryBtn}`}
          >
            <Send className="h-4 w-4" />
            <span>{status === 'submitting' ? 'Submitting...' : 'Submit Enrolment Registration'}</span>
          </button>

          {feedback && (
            <div
              className={`rounded-xl border p-3.5 text-xs flex items-start gap-2 ${
                status === 'success'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
                  : 'border-red-500/40 bg-red-500/10 text-red-700'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{feedback}</span>
            </div>
          )}
        </form>
      </div>

      {/* Faculty Contact Sidebar */}
      <aside className={`lg:col-span-5 rounded-2xl border p-6 space-y-5 ${theme.cardBg}`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className={`h-4 w-4 ${theme.accentText}`} />
          <span className={theme.accentText}>Faculty Desk</span>
        </div>
        <h3 className={`font-cinzel text-xl font-bold ${theme.heading}`}>
          Direct Academic Guidance
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed ${theme.text}`}>
          <strong>Sarika Kumari</strong> leads the School of Foreign Languages – Russian within{' '}
          <em>Soul of Russia and India</em>, helping Indian university applicants, researchers,
          and heritage enthusiasts build confident written and spoken Russian.
        </p>
        <div className={`rounded-xl border p-4 space-y-2 text-xs ${theme.subCardBg}`}>
          <div className={`font-bold ${theme.heading}`}>Direct Teacher Email</div>
          <a
            href="mailto:sarikakumari10500@gmail.com"
            className={`inline-flex items-center gap-1.5 font-semibold hover:underline ${theme.accentText}`}
          >
            <Mail className="h-4 w-4" />
            <span>sarikakumari10500@gmail.com</span>
          </a>
        </div>
        <div className={`rounded-xl border p-4 space-y-1.5 text-xs ${theme.subCardBg}`}>
          <div className={`font-bold ${theme.heading}`}>Included Free With Every Enrolment</div>
          <ul className={`space-y-1 ${theme.text}`}>
            <li>• Full Level 0–B2 Curriculum & Reading Library (A1–C2)</li>
            <li>• SM-2 Spaced-Repetition Vocabulary Flashcards</li>
            <li>• Written Homework Review & Progress Tracking</li>
            <li>• Institutional Completion Certificates upon level mastery</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
