import _ from "lodash";
import { IVideo } from "./video";
import Event from "./event";

/**
 * Module handles storage and retrieval of videos found across all tabs.
 */

const VIDEOS_STORAGE_KEY = "videos";

export default class VideoManager {
    getVideos(tabId?: number): IVideo[] {
        let videos: IVideo[] = JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY));
        if (typeof tabId === "number")
            videos = videos.filter((video: IVideo) => video.tabId === tabId)
        return videos;
    }
    private setVideos(videos: IVideo[]) {
        localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
    }
    pushVideo(video: IVideo): void {
        var that = this;
        let videos = this.getVideos();
        videos.unshift(video);
        //why?
        videos = _.uniqBy(
            videos,
            (vid) => vid.url,
        );
        this.setVideos(videos);

        //figure out how to communicate with other scripts that we have updated the videos
        chrome.runtime.sendMessage({
            type: Event.UPDATED_VIDEOS,
            videos: videos
        })
    }
}