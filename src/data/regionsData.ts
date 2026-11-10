import { Region } from '../types';
import { russiaRegionsPart1 } from './russiaRegionsPart1';
import { russiaRegionsPart2 } from './russiaRegionsPart2';
import { russiaRegionsPart3 } from './russiaRegionsPart3';
import { indiaRegionsPart1 } from './indiaRegionsPart1';
import { indiaRegionsPart2 } from './indiaRegionsPart2';

export const initialRussianRegions: Region[] = [
  ...russiaRegionsPart1,
  ...russiaRegionsPart2,
  ...russiaRegionsPart3,
];

export const initialIndianRegions: Region[] = [
  ...indiaRegionsPart1,
  ...indiaRegionsPart2,
];

export const regionsData: Region[] = [
  ...initialRussianRegions,
  ...initialIndianRegions,
];
