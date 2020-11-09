import { detectVideo, DetectionMethod } from '../shared/detection';
import VideoManager from '../shared/videoManager';

export default class WebRequestListener {
    listen(webRequest: chrome.webRequest.WebRequestBodyDetails) {
        const that = this;
        const tabId = webRequest.tabId;
        if (tabId > 0) {
            chrome.tabs.get(tabId, (tab) => {
                const video = detectVideo(webRequest.url, tab, DetectionMethod.MEDIA_REQUEST);
                if (video)
                    VideoManager.pushVideo(video);
            });
        }
    }
}