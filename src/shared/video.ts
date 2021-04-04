import { DetectionMethod } from './detection';
export { DetectionMethod }

export interface VideoRequirement {

}

export class HeaderRequirement implements VideoRequirement {
  key: string
  value: string
}

export interface IVideo {
  url: string;
  title: string;
  detectionMethod: DetectionMethod;
  timestamp: number;
  tabId?: number;
  requirements?: VideoRequirement[]
}
