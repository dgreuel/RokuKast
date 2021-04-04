import { IVideo, HeaderRequirement } from './video'

interface RokuRequest {
  title: string;
  sentLink: string;
  requiredHeaders?: Map<string, string>;
}

enum Format {
  HLS = "hls",
  MP4 = "mp4"
}

const ROKU_TEST_CHANNEL_ID = "63218"
const PLAY_ON_ROKU_CHANNEL_ID = "15985"

/**
 * Post the video request information to the Roku
 * @param rokuRequest video information
 * @param ip ip address of the roku
 * @param format the video format
 */
function sendXhrRequest(rokuRequest: RokuRequest, ip: string, format: Format) {
  // TODO: this is kinda messy

  const xhr = new XMLHttpRequest();
  xhr.open("HEAD", rokuRequest.sentLink, true);
  xhr.onload = () => {
    const u = encodeURIComponent(xhr.responseURL);
    const videoName = encodeURIComponent(rokuRequest.title);

    let url: string;
    if (rokuRequest.requiredHeaders.size > 0) {
      //play on roku doesn't seem to support passing in headers, so we need to use the test channel for that
      const headers = encodeURIComponent(JSON.stringify(rokuRequest.requiredHeaders));
      url = `http://${ip}:8060/launch/${ROKU_TEST_CHANNEL_ID}?url=${u}&fmt=Auto&headers=${headers}`;
    } else {
      //preferred method, does not require adding a channel to your roku
      url = `http://${ip}:8060/input/${PLAY_ON_ROKU_CHANNEL_ID}?t=v&u=${u}&videoName=${videoName}&videoFormat=${format}`
    }
    console.log(`Sending ${url}`);

    const request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = () => {
      console.log(`Destination IP is loading URL: ${url}`)
    }
    request.onload = () => {
      console.log(`Failed to send URL to destination IP: ${url}`)
    }
    request.send("");
  };
  xhr.send(null);
}

/**
 * Determine the format of the video.
 * TODO: understand this.
 * @param rokuRequest 
 */
function getVideoFormat(rokuRequest: RokuRequest): Format {
  let isHLS = rokuRequest.sentLink.indexOf("m3u") !== -1 || rokuRequest.sentLink.indexOf("hls-vod") !== -1;
  const isPlexStream = rokuRequest.sentLink.indexOf("&mediaIndex=0&partIndex=0&protocol=http") !== -1;

  if (isPlexStream) {
    rokuRequest.sentLink.replace(
      new RegExp("&mediaIndex=0&partIndex=0&protocol=http", "g"),
      "&mediaIndex=0&partIndex=0&protocol=hls",
    );
    isHLS = true;
  }
  return isHLS ? Format.HLS : Format.MP4;
}

export function sendVideoToRoku(video: IVideo) {
  const headers: Map<string, string> = new Map();
  for (let requirement of video.requirements) {
    if (requirement instanceof HeaderRequirement) {
      headers.set(requirement.key, requirement.value)
    }
  }
  sendToRoku({
    title: video.title,
    sentLink: video.url,
    requiredHeaders: headers
  })
}

/**
 * Sends a video request to the configured roku.
 */
export function sendToRoku(rokuRequest: RokuRequest) {
  // tslint:disable-next-line: no-console
  console.dir(rokuRequest);
  if (localStorage.ipAddress !== undefined) {
    const format: Format = getVideoFormat(rokuRequest);
    sendXhrRequest(rokuRequest, localStorage.ipAddress, format);
  } else {
    alert("Please set your roku ip in options page");
  }
}
