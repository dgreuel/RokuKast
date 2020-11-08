import { detectVideo, DetectionMethod } from '../shared/detection';
import { pushVideo } from '../shared/videoManager';

/**
 * Watches all web-requests, attempts to detect video URLs.
 */
export default function webRequestListener(webRequest: chrome.webRequest.WebRequestBodyDetails) {
    const tabId = webRequest.tabId;
    if (tabId > 0) {
        chrome.tabs.get(tabId, (tab) => {
            const video = detectVideo(webRequest.url, tab, DetectionMethod.MEDIA_REQUEST);
            if (video)
                pushVideo(video);
        });
    }
}