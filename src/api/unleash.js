import api from '@forge/api';

const NOT_FOUND = 404;

const getApiUrl = (subpath) => `${process.env.UNLEASH_API_URL}${subpath}`;
const getToggleUrl = (issueKey) => {
    const url = `${getApiUrl('/api/client/features')}/${issueKey}`;
    console.info(url);
    return url;
}

const getCreateUrl = () => getApiUrl('/api/admin/features');

const getArchiveUrl = (issueKey) => `${getApiUrl('/api/admin/archive/features')}/${issueKey}`;

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

const createFeatureToggle = async (issueKey) => {
    const unleashApiKey = getApiKey();
    const featureRequest = {
        name: issueKey,
        enabled: false,
        strategies: [{ name: 'default' }]
    };
    console.info(`Creating feature toggle ${issueKey}`);
    const data = await api.fetch(getCreateUrl(), {
        headers: { 'Authorization': unleashApiKey },
        body: JSON.stringify(featureRequest),
        method: 'POST'
    });
    return data.ok;
}

export const unleash = {
    fetchFeatureToggle,
    createFeatureToggle
};
