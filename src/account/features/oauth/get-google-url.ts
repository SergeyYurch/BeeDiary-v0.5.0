import * as process from 'process';

export function getGoogleOauthUrl() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: process.env.OAUTH_GOOGLE_REDIRECT_URL,
    client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    access_type: '',
    state: 'some st ate',
    prompt: 'consent',
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}
