import VideoManager, { IVideo, DetectionMethod, limitVideos } from '../../src/shared/videoManager';

test('videos limited to 10, older videos pruned', () => {
    const videos = [
        makeVideo(1),
        makeVideo(2),
        makeVideo(3),
        makeVideo(4),
        makeVideo(5),
        makeVideo(6),
        makeVideo(7),
        makeVideo(8),
        makeVideo(9),
        makeVideo(10),
        makeVideo(11),
        makeVideo(12)
    ];

    const limitedVideos = limitVideos(videos);
    expect(limitedVideos.length).toBe(10);
    expect(limitedVideos[0].timestamp).toBe(12);
    expect(limitedVideos[9].timestamp).toBe(3);
});

test('videos ordered correctly', () => {
    const videos = [
        makeVideo(12),
        makeVideo(1),
        makeVideo(3)
    ];

    const limitedVideos = limitVideos(videos);
    expect(limitedVideos.length).toBe(3);
    expect(limitedVideos[0].timestamp).toBe(12);
    expect(limitedVideos[1].timestamp).toBe(3);
    expect(limitedVideos[2].timestamp).toBe(1);
});

function makeVideo(timestamp: number): IVideo {
    return {
        url: '',
        title: '',
        detectionMethod: DetectionMethod.MEDIA_REQUEST,
        timestamp: timestamp,
        tabId: 1
    }
}