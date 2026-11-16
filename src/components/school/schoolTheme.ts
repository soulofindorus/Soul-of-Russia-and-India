export interface SchoolThemeTokens {
  isDark: boolean;
  pageBg: string;
  cardBg: string;
  subCardBg: string;
  border: string;
  heading: string;
  text: string;
  muted: string;
  accentText: string;
  accentBgSoft: string;
  primaryBtn: string;
  secondaryBtn: string;
  inputCls: string;
  tableHeader: string;
  tableRow: string;
}

export function getSchoolTheme(isDark: boolean): SchoolThemeTokens {
  if (isDark) {
    return {
      isDark: true,
      pageBg: 'bg-[#09101d] text-slate-100',
      cardBg: 'bg-[#0f182a] border-slate-800',
      subCardBg: 'bg-[#142036] border-slate-800/90',
      border: 'border-slate-800',
      heading: 'text-white',
      text: 'text-slate-200',
      muted: 'text-slate-400',
      accentText: 'text-amber-300',
      accentBgSoft: 'bg-amber-500/10 border-amber-500/25 text-amber-200',
      primaryBtn:
        'bg-crimson-600 bg-[#9b1c2e] hover:bg-[#b52236] text-white border border-[#b52236]',
      secondaryBtn:
        'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
      inputCls:
        'bg-[#0b1322] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none',
      tableHeader: 'bg-slate-900 text-amber-300 border-slate-800',
      tableRow: 'border-slate-800/80 hover:bg-slate-900/50',
    };
  }

  return {
    isDark: false,
    pageBg: 'bg-[#f8f9fb] text-slate-900',
    cardBg: 'bg-white border-slate-200',
    subCardBg: 'bg-slate-50/80 border-slate-200/90',
    border: 'border-slate-200',
    heading: 'text-[#0c1b33]',
    text: 'text-slate-700',
    muted: 'text-slate-500',
    accentText: 'text-[#8b1e2f]',
    accentBgSoft: 'bg-[#fdf2f4] border-[#f2cfd5] text-[#7f1d2c]',
    primaryBtn:
      'bg-[#0c1b33] hover:bg-[#162d52] text-white border border-[#0c1b33]',
    secondaryBtn:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300',
    inputCls:
      'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#0c1b33] focus:outline-none',
    tableHeader: 'bg-[#0c1b33] text-white border-[#0c1b33]',
    tableRow: 'border-slate-200 hover:bg-slate-50',
  };
}
