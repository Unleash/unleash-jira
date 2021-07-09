import { storage } from '@forge/api';
import Resolver from '@forge/resolver';

import { unleash } from './api/unleash';

const resolver = new Resolver();

resolver.define('getApi', () => {
  return unleash.getApi();
});

resolver.define('getToggleName', ({ context }) => {
  return unleash.getToggleName(context);
});

resolver.define('setToggleName', ({ context, payload }) => {
  return unleash.saveToggleName(context, payload.toggleName);
})

resolver.define('getIssueKey', ({ context }) => {
  return unleash.getIssueKey(context);
});

resolver.define('fetchUiConfig', () => {
  return unleash.fetchUiBootstrap();
});

resolver.define('fetchFeatureToggle', ({ payload }) => {
  console.log(payload);
  const { toggleName } = payload;
  return unleash.fetchFeatureToggle(toggleName);
});

resolver.define('fetchFeatureNames', () => {
  return unleash.fetchFeatureNames();
});

resolver.define('getFrontendFeatureUrl', ({ payload }) => {
  const { toggleName } = payload;
  return unleash.getFrontendFeatureUrl(toggleName);
});

resolver.define('createFeatureToggle', ({ payload }) => {
  const { toggleData } = payload;
  return unleash.createFeatureToggle(toggleData);
});
// const fetchUiBootstrap = async () => {
//   const unleashApiKey = await getApiKey();
//   const data = await fetch(await bootstrapUrl(), getAuth());

//   if (data.ok) {
//     const json = await data.json();
//     return {
//       featureTypes: json.featureTypes,
//       projects: json.projects,
//     };
//   }
// };

// const getApiKey = async () => {
//   return await storage.get(API_KEY_STORAGE_KEY);
// };

// const getAuth = async () => {
//   const apiKey = await getApiKey();
//   return { headers: { Authorization: apiKey } };
// };

// const bootstrapUrl = async () =>
//   await getApiUrl('/api/admin/ui-bootstrap');

export const handler = resolver.getDefinitions();
