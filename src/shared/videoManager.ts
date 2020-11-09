import _ from "lodash";
import { IVideo } from "./video";

function makeTabKey(tabId: number) {
    return tabId + "_videos";
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