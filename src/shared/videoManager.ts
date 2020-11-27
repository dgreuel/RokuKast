import _ from "lodash";
import { DetectionMethod, IVideo } from "./video";
export { IVideo, DetectionMethod };

function makeTabKey(tabId: number) {
    return tabId + "_videos";
}

const VIDEOS_PER_TAB = 10;

/**
 * Ensures that we cleanup all the videos for a given tab, don't need to keep old videos, we might
 * run out of storage space.
 * @param videos limited videos array
 */
export function limitVideos(videos: IVideo[]): IVideo[] {
    return _.chain(videos)
        .sortBy(v => v.timestamp).reverse()
        .take(VIDEOS_PER_TAB)
        .value();
}

export default class VideoManager {
    static getVideos(tabId: number, callback: (videos: IVideo[]) => void) {
        const tabKey = makeTabKey(tabId);
        chrome.storage.local.get(tabKey, function (result: IVideo[]) {
            callback(result.hasOwnProperty(tabKey) ? result[tabKey] : []);
        });
    }
    static pushVideo(video: IVideo): void {
        this.getVideos(video.tabId, (videos: IVideo[]) => {
            videos.unshift(video);
            //why?
            videos = _.uniqBy(
                videos,
                (vid) => vid.url,
            );
            videos = limitVideos(videos);

            const tabKey = makeTabKey(video.tabId);
            const newValue = {}
            newValue[tabKey] = videos
            chrome.storage.local.set(newValue);
        });
    }
    static onTabChanges(tabId: number, callback: (videos: IVideo[]) => void) {
        const tabKey = makeTabKey(tabId);
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (var key in changes) {
                if (key == tabKey) {
                    callback(changes[key].newValue);
                }
            }
        });
    }
}