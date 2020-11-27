import { IVideo } from './video';
import _ from 'lodash';

export enum DetectionMethod {
    MEDIA_REQUEST = "media request",
    VIDEO_TAG = "video tag"
}

/**
 * TODO: make this a lot smarter
 * @param url
 */
function detectMediaRequest(url: string) {
    if (url.endsWith(".ts")) {
        // don't capture transport stream files (chunks)
        return false;
    } else if (url.match(/input\/15985/)) {
        // don't capture requests to Roku
        return false;
    } else if (url.match(/\.(m3u)|(mp4)/) || url.match(/hls-vod/)) {
        // only look for valid video formats
        if (url.match(/mp666Frag/)) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

export function detectVideo(url: string, tab: chrome.tabs.Tab, detectionMethod: DetectionMethod): IVideo {
    if (!detectMediaRequest(url)) {
        return;
    }

    console.log("detected: " + url);

    let title = tab.title;
    if (!title) {
        title = url.split("/").pop();
    }

    return {
        tabId: tab.id,
        title: title,
        detectionMethod: detectionMethod,
        timestamp: new Date().getTime(),
        url: url
    };
}