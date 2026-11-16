import React from 'react';
import { Language } from '../types';
import { SchoolShell } from './school/SchoolShell';

interface LanguageViewProps {
  currentLang: Language;
}

export const LanguageView: React.FC<LanguageViewProps> = ({ currentLang }) => {
  return <SchoolShell currentLang={currentLang} />;
};

