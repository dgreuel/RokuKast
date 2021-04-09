import { DetectionMethod } from './detection';
export { DetectionMethod }

export class HeaderRequirement {
  key: string
  value: string
}

/**
 * Be careful when using polymorphism or classes in this API. Instances of this end up going in and out of the
 * local storage, which doesn't like classes very much.
 */
export interface IVideo {
  url: string;
  title: string;
  detectionMethod: DetectionMethod;
  timestamp: number;
  tabId?: number;
  requiredHeaders?: HeaderRequirement[]
}
