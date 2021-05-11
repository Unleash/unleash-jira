import ForgeUI, {render, Fragment, Text, IssuePanel, useProductContext, useState, Button, Image, Link} from '@forge/ui';
import {unleash} from "./api/unleash";


const UnleashCommunicationFailure = () => <Text children="Could not reach Unleash API"/>;


const UnleashToggleStatus = ({ issueKey, enabled }) => {
    const featureUrl = `${process.env.UNLEASH_API_URL}/api/admin/features/${issueKey}`;
    return (
        <Text><Image src="something" alt={enabled ? 'enabled' : 'false'}></Image> - Feature toggle for <Link
            href={featureUrl}>{issueKey}</Link> is {enabled ? 'enabled' : 'disabled'}</Text>
    );
};

const CreateToggle = ({ issueKey, setFeature }) => (<Fragment>
    <Text>The feature toggle for {issueKey} does not exist.</Text>
    <Button text={`Click to create toggle for ${issueKey}`} onClick={async () => {
        await unleash.createFeatureToggle(issueKey)
        setFeature({ enabled: false, creatable: false, errors: false, found: true });
    }}/>
</Fragment>);

const CannotCreateToggle = ({ issueKey }) => <Text>Can not create toggle for {issueKey}. A toggle already exists with
    that name</Text>;

const CreatableToggle = ({ creatable, issueKey, setFeature }) => {
    return (<Fragment>{creatable
        ? <CreateToggle issueKey={issueKey} setFeature={setFeature} />
        : <CannotCreateToggle issueKey={issueKey}/>}
            </Fragment>);
};

const UnleashToggle = ({ setFeature, found, issueKey, enabled, creatable }) => {
    return (<Fragment>
        {found
            ? <UnleashToggleStatus issueKey={issueKey} enabled={enabled}/>
            : <CreatableToggle creatable={creatable} issueKey={issueKey} setFeature={setFeature}/>
            }
    </Fragment>);
};

const FeatureToggleComponent = ({ issueKey }) => {
    const [feature, setFeature] = useState(async () => {
        const data = await unleash.fetchFeatureToggle(issueKey);
        return data;
    });
    console.info(feature)
    return (
        <Fragment>
            {feature.errors ? <UnleashCommunicationFailure/> : <UnleashToggle setFeature={setFeature} found={feature.found} creatable={feature.creatable} issueKey={issueKey} enabled={feature.enabled} />}
        </Fragment>
    )
}

const App = () => {
    const context = useProductContext();
    const issueKey = context.platformContext.issueKey;
    return (
        <Fragment>
            <FeatureToggleComponent issueKey={issueKey}/>
        </Fragment>
    );
};

export const run = render(
    <IssuePanel>
        <App/>
    </IssuePanel>
);
