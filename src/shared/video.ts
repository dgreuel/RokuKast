import { DetectionMethod } from './detection';

export interface IVideo {
  url: string;
  title: string;
  detectionMethod: DetectionMethod;
  tabId?: number;
}
