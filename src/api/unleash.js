import api from '@forge/api';

const NOT_FOUND = 404;

const getApiUrl = (subpath) => `${process.env.UNLEASH_API_URL}${subpath}`;
const getToggleUrl = (issueKey) => {
    const url = `${getApiUrl('/api/admin/features')}/${issueKey}`;
    console.info(url);
    return url;
}

const getCreateUrl = () => getApiUrl('/api/admin/features');

const getArchiveUrl = (issueKey) => `${getApiUrl('/api/admin/archive/features')}/${issueKey}`;

const getProjectUrl = () => getApiUrl('/api/admin/projects');

const bootstrapUrl = () => getApiUrl('/api/admin/ui-bootstrap');

const getApiKey = () => {
    return process.env.UNLEASH_API_KEY;
}

const getAuth = () => {
    const apiKey = getApiKey();
    return { headers: { 'Authorization': apiKey }};
}

const getArchivedToggle = async (issueKey) => {
    const archived = await api.fetch(getArchiveUrl(issueKey), getAuth());
    return archived.ok;
}

const fetchFeatureToggle = async (issueKey) => {
    const res = await api.fetch(getToggleUrl(issueKey), getAuth());
    if (res.ok) {
        console.info('Successfully fetched toggle');
        const data = await res.json();
        return { enabled: data.enabled, errors: false, found: true, creatable: false };
    } else if (res.status === NOT_FOUND) {
        console.info('404ed, check archived');
        const archived = await getArchivedToggle(issueKey);
        return { enabled: false, found: false, errors: false, creatable: !archived.ok };
    } else {
        console.info(`Errored ${res.status}`);
        return { enabled: false, found: false, errors: true, creatable: false };
    }
}

const createFeatureToggle = async (toggleData) => {
    const unleashApiKey = getApiKey();
    const featureRequest = {
        name: toggleData.name,
        enabled: toggleData.enabled || false,
        project: toggleData.project || 'default',
        description: toggleData.description,
        strategies: [{ name: 'default' }]
    };
    console.info(`Creating feature toggle ${toggleData.name}`);
    const data = await api.fetch(getCreateUrl(), {
        headers: { 'Authorization': unleashApiKey },
        body: JSON.stringify(featureRequest),
        method: 'POST'
    });
    return data.ok;
}

const fetchProjects = async () => {
    const unleashApiKey = getApiKey();
    const data= await api.fetch(getProjectUrl(), {
        headers: { 'Authorization': unleashApiKey },
    });
    if (data.ok) {
        const json = await data.json()
        return json.projects.map(p => {
            return {
                id: p.id,
                name: p.name
            };
        });
    }
    return []
}

const fetchUiBootstrap = async () => {
    const unleashApiKey = getApiKey();
    const data = await api.fetch(bootstrapUrl(), {
        headers: { 'Authorization': unleashApiKey },
    });
    if (data.ok) {
        const json = await data.json();
        return {
            featureTypes: json.featureTypes,
            projects: json.projects,
        }
    }
}

export const unleash = {
    fetchFeatureToggle,
    createFeatureToggle,
    fetchProjects,
    fetchUiBootstrap
};
