import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Compass, Sparkles, GraduationCap, Heart, Award, Mail, Globe, Users, Target, BookOpen, Send, Youtube, Instagram } from 'lucide-react';
import sarikaImg from '../assets/images/regenerated_image_1790026251186.jpg';
import ritikImg from '../assets/images/regenerated_image_1790028450398.jpg';

interface AboutViewProps {
  currentLang: Language;
  onNavigate: (section: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ currentLang, onNavigate }) => {
  const t = translations[currentLang];

  return (
    <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold tracking-wider text-amber-300 uppercase">
          <Users className="h-3.5 w-3.5" />
          <span>Cultural Diplomacy • Youth Engagement</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-wide">
          {t.about.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-serif-culture">
          {t.about.leadText}
        </p>
      </div>

      {/* Vision & Purpose Manifest Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#0e172a] to-[#070c18] p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel text-lg font-bold">
              <Compass className="h-5 w-5" />
              <span>Vision & Purpose</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
              {t.about.bodyText}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel text-lg font-bold">
              <BookOpen className="h-5 w-5" />
              <span>Language & Archaeology</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
              Language is the living vessel of a people’s soul. By uniting grammar pedagogy with archaeological excavation history—from Gnezdovo’s birch bark scrolls to Nalanda’s monastic libraries—we restore deep civilizational memory.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel text-lg font-bold">
              <Target className="h-5 w-5" />
              <span>Youth Empowerment</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
              True cultural understanding flourishes when young scholars, linguists, artists, and researchers collaborate directly through bilateral fellowships, Olympiads, and joint multimedia storytelling.
            </p>
          </div>
        </div>

        {/* Bilateral Values Row */}
        <div className="border-t border-slate-800 pt-8 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800">
            <span className="font-cinzel text-2xl font-bold text-amber-400">100%</span>
            <span className="block text-xs text-slate-400 mt-1">Independent Cultural Mission</span>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800">
            <span className="font-cinzel text-2xl font-bold text-blue-400">3</span>
            <span className="block text-xs text-slate-400 mt-1">Living Languages (EN, RU, HI)</span>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800">
            <span className="font-cinzel text-2xl font-bold text-orange-400">500+</span>
            <span className="block text-xs text-slate-400 mt-1">Years of Friendship & Dialogue</span>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-4 border border-slate-800">
            <span className="font-cinzel text-2xl font-bold text-emerald-400">Open</span>
            <span className="block text-xs text-slate-400 mt-1">Youth Fellowship Portal</span>
          </div>
        </div>
      </div>

      {/* Leadership & Project Team (Sarika Kumari & Ritik Kumar Singh) */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide">
            {t.about.leadershipTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Dedicated educators and cultural ambassadors bridging two ancient civilizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* HEAD OF PROJECT: Sarika Kumari */}
          <div className="group rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#0c1424] to-[#070d18] p-8 shadow-2xl transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-amber-400/80 shadow-lg shrink-0">
                  <img
                    src={sarikaImg}
                    alt="Sarika Kumari"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                    {t.about.headTitle}
                  </span>
                  <h3 className="font-cinzel mt-1 text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {t.about.headName}
                  </h3>
                  <p className="text-xs text-amber-200/80 font-serif-culture">
                    {t.about.headRole}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
                {t.about.headRole}
              </p>

              <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Curriculum architect of bilingual comparative Russian-Hindi pedagogy.</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <span>Promoter of Pushkin, Tolstoy, and classical Slavic literature in India.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Mail className="h-3.5 w-3.5" />
                  <a href="mailto:sarikakumari10500@gmail.com" className="hover:underline text-amber-400">
                    <span>sarikakumari10500@gmail.com</span>
                  </a>
                </span>
                <span>New Delhi / Moscow</span>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://t.me/Sarikajnu34"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-blue-400 hover:text-blue-400 hover:scale-110"
                  title="Telegram (@Sarikajnu34)"
                >
                  <Send className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://vk.ru/sarikajnu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-indigo-400 hover:text-indigo-400 hover:scale-110 text-[10px] font-bold font-serif"
                  title="VKontakte (@sarikajnu)"
                >
                  VK
                </a>
                <a
                  href="https://youtube.com/@misssarika3046?si=amd-XRr97iJ2HT4H"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-red-500 hover:text-red-400 hover:scale-110"
                  title="YouTube (@misssarika3046)"
                >
                  <Youtube className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/not.sarika_?stkn=ZWdubW9tY292Yml5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 transition-all hover:border-pink-400 hover:text-pink-400 hover:scale-110"
                  title="Instagram (@not.sarika_)"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* MANAGER OF PROJECT: Ritik Kumar Singh */}
          <div className="group rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#0c1424] to-[#070d18] p-8 shadow-2xl transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-blue-400/80 shadow-lg shrink-0">
                  <img
                    src={ritikImg}
                    alt="Ritik Kumar Singh"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-300 border border-blue-500/30">
                    {t.about.managerTitle}
                  </span>
                  <h3 className="font-cinzel mt-1 text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {t.about.managerName}
                  </h3>
                  <p className="text-xs text-blue-200/80 font-serif-culture">
                    {t.about.managerRole}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif-culture">
                {t.about.managerRole}
              </p>

              <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span>Organizer of student exchanges, cultural summits, and academic grants.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>Connecting universities and youth researchers across Russia and India.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Mail className="h-3.5 w-3.5" />
                <a href="mailto:ritikjnucrs@gmail.com" className="hover:underline text-blue-400">
                  <span>ritikjnucrs@gmail.com</span>
                </a>
              </span>
              <span>Project Management & Outreach</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-600/20 via-blue-600/20 to-orange-600/20 p-8 text-center space-y-4">
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
          Become Part of the Intercultural Bridge
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Whether you are a student, teacher, researcher, or cultural enthusiast, Soul of Russia and India welcomes your contributions, translations, and research collaborations.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('opportunities')}
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md"
          >
            Explore Opportunities
          </button>
          <button
            onClick={() => onNavigate('heritage')}
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:border-amber-400"
          >
            Discover Heritage
          </button>
        </div>
      </div>
    </section>
  );
};
