import Event from '../shared/event';
import { IVideo } from "../shared/video";
import { DetectionMethod } from "../shared/detection";

/**
 * This module handles all of the page-crawling to pull potential videos out of the UI.
 */

function handleVideoElement(videoElement: HTMLVideoElement) {
  const videoUrl = videoElement.src;
  console.log(`video element detected: ${videoUrl}`);
  if (videoUrl.indexOf("blob:") === -1) {
    const video: IVideo = {
      detectionMethod: DetectionMethod.VIDEO_TAG,
      title: document.title.substring(
        0,
        document.title.length < 100 ? document.title.length : 99,
      ),
      url: videoUrl
    };
    if (!!video.url && !!video.title) {
      chrome.runtime.sendMessage({ type: Event.ADD_VIDEO, video });
    }
  }
}

function handleIframeElement(iframe: HTMLIFrameElement) {
  if (iframe.src) {
    console.log(`iframe detected: ${iframe.src}`);
  }
  try {
    if (iframe.contentDocument) handleDocument(iframe.contentDocument);
  } catch (e) { }
  try {
    if (iframe.contentWindow.document) handleDocument(iframe.contentWindow.document);
  } catch (e) { }
}

function handleDocument(document: Document) {
  try {
    const iframes: HTMLIFrameElement[] = Array.from(document.getElementsByTagName("iframe"));
    const videoElements: HTMLVideoElement[] = Array.from(document.getElementsByTagName("video"));
    for (const iframe of iframes) {
      handleIframeElement(iframe);
    }
    for (const videoElement of videoElements) {
      handleVideoElement(videoElement);
    }
  } catch (e) {
    console.error("Failed to handle document: " + e);
  }
}

/**
 * This appears to be checking the page for anything that might be playing a video.
 */
setInterval(() => {
  handleDocument(document);
}, 5000);
