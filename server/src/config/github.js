export const GITHUB_USERNAME    = 'DpkRn';
export const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
export const GITHUB_REST_URL    = 'https://api.github.com';

export function getGithubToken() {
  return process.env.GITHUB_TOKEN;
}
