import api, {storage} from "@forge/api";
import {unleash} from "./api/unleash";


function requestJira(method, url, body) {
    const bodyJ = JSON.stringify(body);
    console.log(`REQUEST: ${method} ${url}`);
    console.log(`BODY: ${bodyJ}`);
    return api.asApp().requestJira(url, {
        method,
        body: bodyJ
    }).then(r => r.json());
}

async function findCustomField() {
    console.log("Getting fields from JIRA");
    const response = await requestJira('GET', `/rest/api/2/field`);
    console.log("Got fields from JIRA");
    const field = response.find(field => field.name === 'unleash-toggles')
    console.log(field);
    await unleash.saveCustomField(field.id);
}

async function setFeatureToggleField(issueId, toggles) {
    const fieldId = await unleash.getCustomField();
    return requestJira("PUT", `/rest/api/2/app/field/${fieldId}/value`, {
        updates: [{
            issueIds: [issueId],
            value: toggles
        }]
    });
}

export async function issueUpdate(event) {
    const issueKey = event.issue.key;
    if (issueKey) {
        const toggleName = await storage.get(`unleash_toggle_${issueKey}`)
        if (toggleName) {
            const featureToggle = await unleash.fetchFeatureToggle(toggleName);
            if (featureToggle.found) {
                const data = await setFeatureToggleField(event.issue.id, [toggleName]);
                console.log("We're here");
                console.log(`RESPONSE ${data}`);
            }
        }
    }
}

export async function getFieldId(event) {
    const fieldId = await unleash.getCustomField();
    try {
        if (fieldId.indexOf('customfield') > -1) {
            console.log(`Custom field is ${fieldId}`);
        } else {
            console.log("Custom field was not set")
            const field = findCustomField();
            console.log(`Saving field ${field}`);
            await unleash.saveCustomField(field);
        }
    } catch (e) {
        if (e instanceof TypeError) {
            console.log("Custom field was not set")
            const field = findCustomField();
            console.log(`Saving field ${field}`);
            await unleash.saveCustomField(field);
        } else {
            console.log("Something else went wrong. Waiting until next issue is created");
        }
    }
}