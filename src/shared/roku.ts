import { IVideo, HeaderRequirement } from './video'

interface RokuRequest {
  title: string;
  sentLink: string;
  requiredHeaders?: { [key: string]: string; };
}

export enum Format {
  HLS = "hls",
  MP4 = "mp4"
}

//https://devtools.web.roku.com/#stream-tester-tool
const ROKU_TEST_CHANNEL_ID = "63218"
//https://support.roku.com/article/208755108
const PLAY_ON_ROKU_CHANNEL_ID = "15985"

/**
 * Generates the URL that should be called to send the roku request to the roku.
 * @param rokuRequest 
 * @param rokuIpAddress 
 * @param format 
 * @returns 
 */
export function _generateRokuUrl(rokuRequest: RokuRequest, rokuIpAddress: string, format: Format): string {
  const videoName = encodeURIComponent(rokuRequest.title);

  let url: string;
  if (Object.keys(rokuRequest.requiredHeaders).length > 0) {
    //play on roku doesn't seem to support passing in headers, so we need to use the test channel for that
    const headers = encodeURIComponent(JSON.stringify(rokuRequest.requiredHeaders));
    url = `http://${rokuIpAddress}:8060/launch/${ROKU_TEST_CHANNEL_ID}?url=${rokuRequest.sentLink}&fmt=Auto&headers=${headers}`;
  } else {
    //preferred method, does not require adding a channel to your roku
    url = `http://${rokuIpAddress}:8060/input/${PLAY_ON_ROKU_CHANNEL_ID}?t=v&u=${rokuRequest.sentLink}&videoName=${videoName}&videoFormat=${format}`
  }

  return url
}

/**
 * Post the video request information to the Roku
 * @param rokuRequest video information
 * @param rokuIpAddress ip address of the roku
 * @param format the video format
 */
function sendXhrRequest(rokuRequest: RokuRequest, rokuIpAddress: string, format: Format) {
  const rokuUrl = _generateRokuUrl(rokuRequest, rokuIpAddress, format)
  console.log(`Sending ${rokuUrl}`);

  const request = new XMLHttpRequest();
  request.open("POST", rokuUrl, true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.onload = () => {
    console.log(`Destination IP is loading URL: ${rokuUrl}`)
  }
  request.onerror = () => {
    console.error(`Failed to send URL to destination IP: ${rokuUrl}`)
  }
  request.send("");
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

export function _getHeaders(requirements: HeaderRequirement[]): { [key: string]: string; } {
  const headers: { [key: string]: string; } = {};
  for (let requirement of requirements) {
    headers[requirement.key] = requirement.value
  }
  return headers;
}

export function sendVideoToRoku(video: IVideo) {
  console.dir(video);
  const headers: { [key: string]: string; } = _getHeaders(video.requiredHeaders)
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
  console.dir(rokuRequest);
  if (localStorage.ipAddress !== undefined) {
    const format: Format = getVideoFormat(rokuRequest);
    // sendXhrRequest(rokuRequest, localStorage.ipAddress, format);
  } else {
    alert("Please set your roku ip in options page");
  }
}
