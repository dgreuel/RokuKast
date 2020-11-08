import Event from '../shared/event';
import { IVideo } from "../shared/video";
import WebRequestListener from './requestListener';
import { pushVideo, getVideos } from '../shared/videoManager';

/**
 * Attempt to detect media requests.
 */
chrome.webRequest.onBeforeRequest.addListener(
  WebRequestListener,
  {
    urls: ["http://*/*", "https://*/*"],
    types: ["media", "xmlhttprequest"],
  },
  [],
);

/**
 * Listen for messages from running extension scripts.
 */
chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender) => {
  console.log(`message received: ${message}`)
  if (message.type === Event.ADD_VIDEO) {
    {
      const video: IVideo = {
        url: message.video.url,
        title: message.video.title,
        detectionMethod: message.video.detectionMethod,
        tabId: sender.tab ? sender.tab.id : undefined
      };
      pushVideo(video);
    }
  } else if (message.type === Event.UPDATED_VIDEOS) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      const videos = getVideos(activeTab.id)
      chrome.browserAction.setBadgeText({ text: videos.length + "" });
    });
  }
  return true;
});
