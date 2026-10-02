import React, { useState } from 'react';
import { Opportunity, Language, OpportunityCategory } from '../types';
import { translations } from '../i18n/translations';
import {
  GraduationCap,
  Search,
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  PlusCircle,
  X,
  Sparkles,
  CheckCircle2,
  Users,
  Building,
  Globe,
  Trash2,
  ShieldCheck,
} from 'lucide-react';

interface OpportunitiesViewProps {
  currentLang: Language;
  opportunities: Opportunity[];
  isAdmin?: boolean;
  onAddOpportunity?: (newOpp: Opportunity) => void;
  onDeleteOpportunity?: (id: string) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  currentLang,
  opportunities,
  isAdmin = false,
  onAddOpportunity,
  onDeleteOpportunity,
}) => {
  const t = translations[currentLang];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAudience, setSelectedAudience] = useState<string>('All');
  const [onlyFullyFunded, setOnlyFullyFunded] = useState<boolean>(false);

  // Selected Opportunity Modal
  const [detailOpp, setDetailOpp] = useState<Opportunity | null>(null);

  // Add Opportunity Modal (Admin only)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<OpportunityCategory>('Scholarship');
  const [newCountry, setNewCountry] = useState<'Russia' | 'India' | 'International'>('Russia');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newEligibility, setNewEligibility] = useState('');
  const [newFormat, setNewFormat] = useState<'Online' | 'Offline' | 'Hybrid'>('Offline');
  const [newFunding, setNewFunding] = useState<'Fully funded' | 'Partially funded' | 'Self-funded' | 'Free entry / Cash prizes'>('Fully funded');
  const [newDescription, setNewDescription] = useState('');
  const [newOfficialLink, setNewOfficialLink] = useState('');

  const categories: OpportunityCategory[] = [
    'Scholarship',
    'Fellowship',
    'Competition',
    'Youth Programme',
    'Conference',
    'Cultural Event',
    'Language Programme',
    'Academic Programme',
    'Volunteer Opportunity',
    'Internship',
  ];

  const audiences = ['All', 'Students', 'Teachers', 'Youth', 'Researchers'];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = selectedCountry === 'All' || opp.country === selectedCountry;
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesAudience =
      selectedAudience === 'All' || opp.targetAudience.includes(selectedAudience as any);
    const matchesFunded = !onlyFullyFunded || opp.funding === 'Fully funded';

    return matchesSearch && matchesCountry && matchesCategory && matchesAudience && matchesFunded;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdOpp: Opportunity = {
      id: `opp-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      country: newCountry,
      deadline: newDeadline,
      daysRemaining: 45,
      eligibility: newEligibility.trim() || 'Open to all qualified applicants.',
      format: newFormat,
      funding: newFunding,
      shortDescription: newDescription.trim() || 'Exciting intercultural opportunity.',
      officialLink: newOfficialLink.trim() || 'https://soulofrussiaandindia.org',
      targetAudience: ['Youth', 'Students'],
      statusBadge: 'Open',
    };

    if (onAddOpportunity) {
      onAddOpportunity(createdOpp);
    }
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewEligibility('');
  };

  const getBadgeStyle = (badge: Opportunity['statusBadge']) => {
    switch (badge) {
      case 'Deadline Soon':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Open':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Fellowship':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Competition':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Conference':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <section className="min-h-screen py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-white/90 px-4 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase shadow-sm">
          <GraduationCap className="h-3.5 w-3.5 text-amber-600" />
          <span>Bilateral Youth & Academic Portal</span>
        </div>
        <h1 className="font-cinzel text-2xl xs:text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-wide break-words">
          {t.opportunities.title}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-serif-culture">
          {t.opportunities.subtitle}
        </p>

        {isAdmin && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 px-4 sm:px-5 py-2 text-xs font-bold text-white shadow-md hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Admin: Add New Opportunity</span>
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-800">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              <span>Admin Active</span>
            </span>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white/85 p-4 sm:p-6 shadow-md space-y-4 w-full">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.opportunities.searchPlaceholder}
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Country Selector */}
            <div className="flex flex-wrap rounded-lg border border-slate-200 bg-slate-100 p-1 gap-1">
              {['All', 'Russia', 'India', 'International'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCountry === c
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="All">{t.opportunities.filterCategory}: All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Target Audience */}
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="All">Audience: All</option>
              {audiences.filter((a) => a !== 'All').map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>

          {/* Fully Funded Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
            <input
              type="checkbox"
              checked={onlyFullyFunded}
              onChange={(e) => setOnlyFullyFunded(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
            />
            <span className="text-amber-300">★ Only Fully Funded</span>
          </label>
        </div>
      </div>

      {/* Opportunities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c1424] p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl"
          >
            <div className="space-y-3">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase">
                  {opp.category}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getBadgeStyle(
                    opp.statusBadge
                  )}`}
                >
                  {opp.statusBadge === 'Deadline Soon'
                    ? `🔴 Deadline Soon`
                    : opp.statusBadge === 'Open'
                    ? `🟢 Open`
                    : opp.statusBadge}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-cinzel text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                {currentLang === 'ru' && opp.titleRu ? opp.titleRu : opp.title}
              </h3>

              {/* Short Description */}
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {opp.shortDescription}
              </p>

              {/* Details Tags */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t.opportunities.filterCountry}:</span>
                  <span className="font-semibold text-slate-200">{opp.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t.opportunities.filterFunding}:</span>
                  <span className="font-semibold text-emerald-400">{opp.funding}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-semibold text-slate-200">{opp.format}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t.opportunities.deadline}:</span>
                  <span className="font-semibold text-amber-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {opp.deadline}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailOpp(opp)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  View Dossier →
                </button>
                {isAdmin && onDeleteOpportunity && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete opportunity: "${opp.title}"?`)) {
                        onDeleteOpportunity(opp.id);
                      }
                    }}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 border border-red-500/30 transition-colors cursor-pointer"
                    title="Admin: Remove Opportunity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <a
                href={opp.officialLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all"
              >
                <span>{t.opportunities.applyNow}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-3">
          <p className="text-slate-400 text-sm">No opportunities match the selected filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCountry('All');
              setSelectedCategory('All');
              setSelectedAudience('All');
              setOnlyFullyFunded(false);
            }}
            className="text-xs text-amber-400 underline font-semibold"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* OPPORTUNITY DETAIL MODAL */}
      {detailOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-[#0c1424] p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setDetailOpp(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-bold text-amber-300">
                  {detailOpp.category}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getBadgeStyle(
                    detailOpp.statusBadge
                  )}`}
                >
                  {detailOpp.statusBadge}
                </span>
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                {detailOpp.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Country</span>
                <span className="font-bold text-white">{detailOpp.country}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Funding</span>
                <span className="font-bold text-emerald-400">{detailOpp.funding}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Format</span>
                <span className="font-bold text-white">{detailOpp.format}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Deadline</span>
                <span className="font-bold text-amber-400">{detailOpp.deadline}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {t.opportunities.eligibility}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed rounded-xl bg-black/40 p-3 border border-slate-800">
                {detailOpp.eligibility}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Program Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {detailOpp.shortDescription}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Official bilateral educational partner
              </span>
              <a
                href={detailOpp.officialLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2 text-xs font-bold text-white shadow-lg hover:from-amber-500"
              >
                <span>Proceed to Official Application</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSE / ADD NEW OPPORTUNITY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-amber-500/30 bg-[#0c1424] p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h2 className="font-cinzel text-xl font-bold text-white">
                Propose an Opportunity
              </h2>
              <p className="text-xs text-slate-400">
                Add a fellowship, scholarship, competition, or language exchange for youth.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Saint Petersburg Cultural Research Fellowship 2027"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Russia">Russia</option>
                    <option value="India">India</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Funding</label>
                  <select
                    value={newFunding}
                    onChange={(e) => setNewFunding(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Fully funded">Fully funded</option>
                    <option value="Partially funded">Partially funded</option>
                    <option value="Free entry / Cash prizes">Free entry / Cash prizes</option>
                    <option value="Self-funded">Self-funded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-100 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={newEligibility}
                  onChange={(e) => setNewEligibility(e.target.value)}
                  placeholder="e.g. University students aged 18-30 with interest in Russian literature"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide an overview of stipends, academic credits, and activities..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Website Link</label>
                <input
                  type="url"
                  value={newOfficialLink}
                  onChange={(e) => setNewOfficialLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 shadow-md"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
