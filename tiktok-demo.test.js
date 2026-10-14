import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTikTokAuthorizeUrl, getConfiguredScopes, isAllowedPrivacy } from './tiktok-demo-server.js';

test('builds a TikTok authorize URL without exposing the client secret', () => {
  const url = buildTikTokAuthorizeUrl({
    clientKey: 'sandbox-key',
    redirectUri: 'https://example.com/auth/tiktok/callback',
    state: 'state-123',
    scopes: ['user.info.basic', 'video.publish']
  });
  const parsed = new URL(url);
  assert.equal(parsed.origin, 'https://www.tiktok.com');
  assert.equal(parsed.searchParams.get('client_key'), 'sandbox-key');
  assert.equal(parsed.searchParams.get('redirect_uri'), 'https://example.com/auth/tiktok/callback');
  assert.equal(parsed.searchParams.get('state'), 'state-123');
  assert.equal(parsed.searchParams.has('client_secret'), false);
});

test('uses only the scopes required for the demo', () => {
  assert.deepEqual(getConfiguredScopes(), ['user.info.basic', 'video.publish']);
});

test('accepts only TikTok privacy levels supported by the demo', () => {
  assert.equal(isAllowedPrivacy('SELF_ONLY'), true);
  assert.equal(isAllowedPrivacy('PUBLIC_TO_EVERYONE'), false);
});
