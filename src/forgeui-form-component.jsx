import ForgeUI, {
  Badge,
  Form,
  Fragment,
  IssuePanel,
  Link,
  Option,
  Select,
  Button,
  Text,
  TextArea,
  TextField,
  Toggle,
  render,
  useProductContext,
  useState,
  ModalDialog,
} from '@forge/ui';
import { storage } from '@forge/api';
import { unleash } from './api/unleash';

const UnleashCommunicationFailure = () => (
  <Text>Could not reach Unleash API</Text>
);

const UnleashToggleStatus = ({ issueKey, toggleName, enabled }) => {
  const [featureUrl, setFeatureUrl] = useState(async () => {
    return await unleash.getFrontendFeatureUrl(toggleName);
  });
  return (
    <Fragment>
      <Text>
        <Link href={featureUrl}>{toggleName}</Link> is{' '}
        {enabled ? (
          <Badge text='enabled' appearance='added' />
        ) : (
          <Badge text='disabled' appearance='removed' />
        )}
      </Text>
    </Fragment>
  );
};

const CreateToggle = ({ uiConfig, issueKey, setFeature }) => {
  return (
    <Fragment>
      <Text>The feature toggle for {issueKey} does not exist.</Text>
      <Form
        onSubmit={async (formData) => {
          await storage.set(`unleash_toggle_${issueKey}`, formData.name);
          await unleash.createFeatureToggle(formData);
          setFeature({
            creatable: false,
            enabled: formData.enabled,
            found: true,
            name: formData.name,
            errors: false,
          });
        }}
        submitButtonText='Create feature toggle'
      >
        <Select label='Project' name='project' isRequired={true}>
          {uiConfig.projects.map(({ id, name }) => (
            <Option
              label={name}
              value={id}
              defaultSelected={id === 'default'}
            />
          ))}
        </Select>
        <Select label='Toggle type' name='type' isRequired={true}>
          {uiConfig.featureTypes.map(({ id, name }) => (
            <Option
              label={name}
              value={id}
              defaultSelected={id === 'release'}
            />
          ))}
        </Select>
        <Toggle
          label='Enable feature'
          name='enabled'
          defaultChecked={false}
        />
        <TextField label='Toggle name' name='name' isRequired={true} />
        <TextArea label='Toggle description' name='description' />
      </Form>
    </Fragment>
  );
};

const FeatureToggle = ({
  uiConfig,
  archived,
  issueKey,
  setFeature,
  toggleName,
}) => {
  const [createModal, setCreateModal] = useState(false);
  const [existingToggle, setExistingToggle] = useState(false);

  return (
    <Fragment>
      <Button
        text='Create and connect feature toggle'
        onClick={() => setCreateModal(true)}
      />

      <Button
        text='Connect existing toggle'
        onClick={() => setExistingToggle(true)}
      />

      {createModal ? (
        <ModalDialog
          header='Create toggle'
          onClose={() => setCreateModal(false)}
          onSubmit
        >
          <CreateToggle
            uiConfig={uiConfig}
            issueKey={issueKey}
            toggleName={toggleName}
            setFeature={setFeature}
          />
        </ModalDialog>
      ) : null}
      {existingToggle ? (
        <ModalDialog
          header='Create toggle'
          onClose={() => setExistingToggle(false)}
          onSubmit
        >
          <LinkExistingToggle
            uiConfig={uiConfig}
            issueKey={issueKey}
            toggleName={toggleName}
            setFeature={setFeature}
          />
        </ModalDialog>
      ) : null}
    </Fragment>
  );
};

const LinkExistingToggle = () => {
  return (
    <Fragment>
      <div>Hello world</div>
    </Fragment>
  );
};

const UnleashToggle = ({
  uiConfig,
  setFeature,
  found,
  issueKey,
  enabled,
  toggleName,
}) => {
  return (
    <Fragment>
      {found ? (
        <UnleashToggleStatus
          toggleName={toggleName}
          issueKey={issueKey}
          enabled={enabled}
        />
      ) : (
        <FeatureToggle
          toggleName={toggleName}
          uiConfig={uiConfig}
          issueKey={issueKey}
          setFeature={setFeature}
        />
      )}
    </Fragment>
  );
};

const FeatureToggleComponent = ({ issueKey, toggleName }) => {
  const [uiConfig, setUiConfig] = useState(async () => {
    return await unleash.fetchUiBootstrap();
  });
  const [feature, setFeature] = useState(async () => {
    return await unleash.fetchFeatureToggle(toggleName);
  });
  return (
    <Fragment>
      {feature.errors ? (
        <UnleashCommunicationFailure />
      ) : (
        <UnleashToggle
          toggleName={feature.name || toggleName}
          uiConfig={uiConfig}
          setFeature={setFeature}
          found={feature.found}
          archived={feature.archived}
          issueKey={issueKey}
          enabled={feature.enabled}
        />
      )}
    </Fragment>
  );
};

const App = () => {
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  const [toggleName, setToggleName] = useState(async () => {
    return await storage.get(`unleash_toggle_${issueKey}`);
  });
  const [apiUrl, _setApiUrl] = useState(async () => {
    return await unleash.getApi();
  });

  return (
    <Fragment>
      {apiUrl ? (
        <FeatureToggleComponent
          toggleName={toggleName}
          issueKey={issueKey}
        />
      ) : (
        <Text>
          You need to configure Unleash using the app's admin page
        </Text>
      )}
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
