import _ from "lodash";
import { IVideo } from "./video";

/**
 * Module handles storage and retrieval of videos found across all tabs.
 */

const VIDEOS_STORAGE_KEY = "videos";

export function getVideos(tabId?: number): IVideo[] {
    let videos: IVideo[] = JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY));
    if (typeof tabId === "number")
        videos = videos.filter((video: IVideo) => video.tabId === tabId)
    return videos;
}

function setVideos(videos: IVideo[]) {
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
}

export function pushVideo(video: IVideo): void {
    let videos = getVideos();
    videos.unshift(video);
    //why?
    videos = _.uniqBy(
        videos,
        (vid) => vid.url === video.url,
    );
    setVideos(videos);
}