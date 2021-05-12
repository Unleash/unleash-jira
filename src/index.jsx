import ForgeUI, {
    Button,
    Form,
    Fragment,
    IssuePanel,
    Link,
    Option,
    Select,
    Text,
    TextArea,
    TextField,
    Toggle,
    render,
    useProductContext,
    useState
} from '@forge/ui';
import { storage } from '@forge/api';
import {unleash} from "./api/unleash";


const UnleashCommunicationFailure = () => <Text>Could not reach Unleash API</Text>;


const UnleashToggleStatus = ({ issueKey, toggleName, enabled }) => {
    const featureUrl = `${process.env.UNLEASH_API_URL}/features/strategies/${toggleName}`;
    return (
        <Fragment>
            <Text>
                <Link href={featureUrl}>Feature toggle for {issueKey}</Link> with name {toggleName} is {enabled ? 'enabled' : 'disabled'}
            </Text>
        </Fragment>
    );
};

const CreateToggle = ({ uiConfig, issueKey, setFeature }) => {
    return (<Fragment>
        <Text>The feature toggle for {issueKey} does not exist.</Text>
        <Form onSubmit={async (formData) => {
            await storage.set(`unleash_toggle_${issueKey}`, formData.name);
            await unleash.createFeatureToggle(formData);
            setFeature({ creatable: false, enabled: formData.enabled, found: true, errors: false });
        }} submitButtonText="Create feature toggle">
            <Select label="Project" name="project" isRequired={true}>
                {uiConfig.projects.map(({ id, name }) =>
                    <Option label={name} value={id} defaultSelected={id === 'default'}/>
                )}
            </Select>
            <Select label="Toggle type" name="type" isRequired={true}>
                {uiConfig.featureTypes.map(({ id, name }) =>
                    <Option label={name} value={id} defaultSelected={id === 'release'} />
                )}
            </Select>
            <Toggle label="Enable feature" name="enabled" defaultChecked={false}/>
            <TextField label="Toggle name" name="name" isRequired={true}/>
            <TextArea label="Toggle description" name="description"/>
        </Form>
    </Fragment>);
}

const CannotCreateToggle = ({ issueKey, toggleName }) => <Text>Can not create toggle for {issueKey}. A toggle already exists with
    the name {toggleName}</Text>;

const CreatableToggle = ({ uiConfig, creatable, issueKey, setFeature, toggleName }) => {
    return (<Fragment>{creatable
        ? <CreateToggle uiConfig={uiConfig} issueKey={issueKey} toggleName={toggleName} setFeature={setFeature}/>
        : <CannotCreateToggle toggleName={toggleName} issueKey={issueKey}/>}
    </Fragment>);
};

const UnleashToggle = ({ uiConfig, setFeature, found, issueKey, enabled, creatable, toggleName }) => {
    return (<Fragment>
        {found
            ? <UnleashToggleStatus toggleName={toggleName} issueKey={issueKey} enabled={enabled}/>
            : <CreatableToggle toggleName={toggleName} uiConfig={uiConfig} creatable={creatable} issueKey={issueKey} setFeature={setFeature}/>
        }
    </Fragment>);
};

const FeatureToggleComponent = ({ issueKey, toggleName }) => {
    const [uiConfig, setUiConfig] = useState(async () => {
        return await unleash.fetchUiBootstrap();
    })
    const [feature, setFeature] = useState(async () => {
        return await unleash.fetchFeatureToggle(toggleName);
    });
    return (
        <Fragment>
            {feature.errors ? <UnleashCommunicationFailure/> :
                <UnleashToggle toggleName={toggleName}
                               uiConfig={uiConfig}
                               setFeature={setFeature}
                               found={feature.found}
                               creatable={feature.creatable}
                               issueKey={issueKey}
                               enabled={feature.enabled}
                />}
        </Fragment>
    )
}

const App = () => {
    const context = useProductContext();
    const issueKey = context.platformContext.issueKey;
    const [toggleName, setToggleName] = useState(async () => {
        return await storage.get(`unleash_toggle_${issueKey}`);
    })
    console.info(toggleName);
    return (
        <Fragment>
            <FeatureToggleComponent toggleName={toggleName || issueKey} issueKey={issueKey}/>
        </Fragment>
    );
};

export const run = render(
    <IssuePanel>
        <App/>
    </IssuePanel>
);
