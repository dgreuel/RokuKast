import { _getHeaders, _generateRokuUrl, Format } from '../../src/shared/roku';
import { HeaderRequirement } from '../../src/shared/video';

test('_getHeaders should return header map', () => {
    const requirements: HeaderRequirement[] = [];
    requirements.push({ key: "foo", value: "bar" })
    const headers = _getHeaders(requirements)
    const expectedHeaders = { "foo": "bar" }
    expect(headers).toEqual(expectedHeaders)
});

test('_generateRokuUrl should use play on roku', () => {
    const request = {
        title: 'test',
        sentLink: 'http://google.com/foo/bar',
        requiredHeaders: {}
    }
    const url = _generateRokuUrl(request, "123:456:0:1", Format.MP4)
    expect(url).toBe('http://123:456:0:1:8060/input/15985?t=v&u=http://google.com/foo/bar&videoName=test&videoFormat=mp4')
});

test('_generateRokuUrl for requiredHeaders shoukd use test channel', () => {
    const request = {
        title: 'test',
        sentLink: 'http://google.com/foo/bar',
        requiredHeaders: { "Origin": "https://hqq.to" }
    }
    const url = _generateRokuUrl(request, "123:456:0:1", Format.MP4)
    expect(url).toBe('http://123:456:0:1:8060/launch/63218?url=http://google.com/foo/bar&fmt=Auto&headers=%7B%22Origin%22%3A%22https%3A%2F%2Fhqq.to%22%7D')
});