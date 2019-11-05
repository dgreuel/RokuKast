# RokuKast

> A Chrome extension to stream web videos to Roku devices.

## Building

1.  Clone repo
2.  `yarn install`
3.  `yarn dev` to compile once or `yarn watch` to run the dev task in watch mode
4.  `yarn build` to build a production (minified) version

## Installation

1.  Complete the steps to build the project above
2.  Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3.  With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this repo

## Usage

The extension detects streamable videos (in **mp4** and **hls** formats) using two methods: searching the DOM for `<video>` tags and monitoring outgoing HTTP requests.

In order to use the Cast function, you must configure your Roku's IP address on the Settings page.

## Credits

This project is based on [RokuCast](https://github.com/pranav-prakash/RokuCast/) by Pranav Prakash and [chrome-extension-react-typescript-boilerplate](https://github.com/martellaj/chrome-extension-react-typescript-boilerplate) by Joe Martella.
