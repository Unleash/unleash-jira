import ForgeUI, {AdminPage, Form, render, Text, TextField, useState, Fragment, Button} from '@forge/ui';
import {storage} from '@forge/api';
import {unleash} from './api/unleash';

const App = () => {
    const [apiUrl, setApiUrl] = useState(async () => {
        return await unleash.getApi();
    });
    const [apiKey, setApiKey] = useState(async () => {
        return await unleash.getApiKey();
    })
    return (
        <AdminPage>
            <Text>Configure your Unleash installation</Text>
            <Form onSubmit={async (formData) => {
                console.log(`Setting data ${JSON.stringify(formData)}`);
                await storage.set(unleash.API_URL_STORAGE_KEY, formData.apiUrl)
                await storage.set(unleash.API_KEY_STORAGE_KEY, formData.apiKey || apiKey)
                setApiUrl(formData.apiUrl);
                setApiKey(formData.apiKey || apiKey);
            }}>
                <TextField label="Unleash API Url" name="apiUrl"
                           placeholder={apiUrl || "The URL to your Unleash instance"}
                           defaultValue={apiUrl}/>
                {apiKey ?
                    <Fragment><Text>Your API key is set, to avoid spilling secrets we're not showing it here.</Text><Button text="Set new api key" onClick={() => setApiKey(undefined)} /></Fragment>
                    : <TextField label="Unleash API Key" name="apiKey" placeholder="An admin API key for your unleash instance"/>
                }
            </Form>
        </AdminPage>
    );
};
export const run = render(
    <App/>
);