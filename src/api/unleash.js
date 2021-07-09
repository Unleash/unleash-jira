import api, { storage } from '@forge/api';

const NOT_FOUND = 404;

const API_URL_STORAGE_KEY = 'unleash_api_url';
const API_KEY_STORAGE_KEY = 'unleash_api_key';
const CUSTOM_FIELD_STORAGE_KEY = 'unleash_custom_field';

const getApi = async () => {
  return await storage.get(API_URL_STORAGE_KEY);
};

const getToggleName = async (context) => {
  const issueKey = context.extension.issue.key;
  return await storage.get(`unleash_toggle_${issueKey}`);
};

const getApiUrl = async (subpath) => `${await getApi()}${subpath}`;
const getToggleUrl = async (toggleName) => {
  return `${await getApiUrl('/api/admin/features')}/${toggleName}`;
};

const getFrontendFeatureUrl = async (toggleName) => {
  return await getApiUrl(`/features/strategies/${toggleName}`);
};

const getCreateUrl = async () => await getApiUrl('/api/admin/features');

const getArchiveUrl = async (issueKey) =>
  `${await getApiUrl('/api/admin/archive/features')}/${issueKey}`;

const getProjectUrl = async () => await getApiUrl('/api/admin/projects');

const bootstrapUrl = async () =>
  await getApiUrl('/api/admin/ui-bootstrap');

const featuresUrl = async () => await getApiUrl('/api/client/features');

const getApiKey = async () => {
  return await storage.get(API_KEY_STORAGE_KEY);
};

const getAuth = async () => {
  const apiKey = await getApiKey();
  return { headers: { Authorization: apiKey } };
};

const getIssueKey = (context) => {
  return context.extension.issue.key;
};

const getCustomField = async () => {
  return await storage.get(CUSTOM_FIELD_STORAGE_KEY);
};

const saveToggleName = async (context, name) => {
  const issueKey = getIssueKey(context);
  console.log(`Saving to unleash_toggle_${issueKey} the name: ${name}`)
  return await storage.set(`unleash_toggle_${issueKey}`, name);
}

const saveCustomField = async (fieldId) => {
  await storage.set(CUSTOM_FIELD_STORAGE_KEY, fieldId);
};

const getArchivedToggle = async (issueKey) => {
  const archived = await api.fetch(
    await getArchiveUrl(issueKey),
    await getAuth()
  );
  return archived.ok;
};

const fetchFeatureToggle = async (issueKey) => {
  if (issueKey) {
    const res = await api.fetch(
      await getToggleUrl(issueKey),
      await getAuth()
    );
    if (res.ok) {
      console.info('Successfully fetched toggle');
      const data = await res.json();
      return { enabled: data.enabled, errors: false, found: true };
    } else if (res.status === NOT_FOUND) {
      console.info('404ed, check archived');
      const archived = await getArchivedToggle(issueKey);
      return {
        enabled: false,
        found: false,
        errors: false,
        archived: archived.ok,
      };
    } else {
      console.info(`Errored ${res.status}`);
      return { enabled: false, found: false, errors: true };
    }
  }
  return { enabled: false, found: false, errors: true };
};

const createFeatureToggle = async (toggleData) => {
  const unleashApiKey = await getApiKey();
  const featureRequest = {
    name: toggleData.name,
    enabled: toggleData.enabled || false,
    project: toggleData.project.value || 'default',
    description: toggleData.description,
    type: toggleData.type.value || 'release',
    strategies: [{ name: 'default' }],
  };
  console.info(`Creating feature toggle `, featureRequest);
  const data = await api.fetch(await getCreateUrl(), {
    headers: { Authorization: unleashApiKey },
    body: JSON.stringify(featureRequest),
    method: 'POST',
  });
  if (data.ok) {
    return data.json();
  } else {
    throw new Error(`Failed with ${data.statusText}`);
  }
};

const fetchProjects = async () => {
  const unleashApiKey = await getApiKey();
  const data = await api.fetch(await getProjectUrl(), {
    headers: { Authorization: unleashApiKey },
  });
  if (data.ok) {
    const json = await data.json();
    return json.projects.map((p) => {
      return {
        id: p.id,
        name: p.name,
      };
    });
  }
  return [];
};

const fetchUiBootstrap = async () => {
  const unleashApiKey = await getApiKey();
  const data = await api.fetch(await bootstrapUrl(), {
    headers: { Authorization: unleashApiKey },
  });
  if (data.ok) {
    const json = await data.json();
    return {
      featureTypes: json.featureTypes,
      projects: json.projects,
    };
  }
};

const fetchFeatureNames = async () => {
  const unleashApiKey = await getApiKey();
  const data = await api.fetch(await featuresUrl(), {
    headers: { Authorization: unleashApiKey },
  });
  if (data.ok) {
    const json = await data.json();
    return json.features.map((feature) => feature.name);
  }
};

export const unleash = {
  fetchFeatureToggle,
  createFeatureToggle,
  fetchProjects,
  fetchUiBootstrap,
  getToggleName,
  getApi,
  getApiUrl,
  getApiKey,
  getIssueKey,
  getCustomField,
  saveCustomField,
  getFrontendFeatureUrl,
  saveToggleName,
  API_KEY_STORAGE_KEY,
  API_URL_STORAGE_KEY,
  CUSTOM_FIELD_STORAGE_KEY,
  fetchFeatureNames,
};
