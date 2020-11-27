import { DetectionMethod } from './detection';
export { DetectionMethod }

export interface IVideo {
  url: string;
  title: string;
  detectionMethod: DetectionMethod;
  timestamp: number;
  tabId?: number;
}
