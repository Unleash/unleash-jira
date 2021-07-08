import { storage } from '@forge/api';
import Resolver from '@forge/resolver';

const API_URL_STORAGE_KEY = 'unleash_api_url';

const resolver = new Resolver();

const getApi = async () => {
  return await storage.get(API_URL_STORAGE_KEY);
};

resolver.define('getApi', () => {
  return getApi();
});

const getToggleName = async (context) => {
  const issueKey = context.extension.issue.key;
  return await storage.get(`unleash_toggle_${issueKey}`);
};

resolver.define('getToggleName', ({ context }) => {
  return getToggleName(context);
});

const getIssueKey = async (context) => {
  const issueKey = context.extension.issue.key;
  return issueKey;
};

resolver.define('getIssueKey', ({ context }) => {
  return getIssueKey(context);
});

export const handler = resolver.getDefinitions();
