import {
  IFeatureToggle,
  IUiConfig,
} from '../FeatureTogglePanel/FeatureTogglePanel';
import { Dispatch, SetStateAction, useState } from 'react';
import Button from '@atlaskit/button/standard-button';
import CreateToggle from '../CreateToggle/CreateToggle';
import LinkExistingToggle from '../LinkExistingToggle/LinkExistingToggle';
import ConditionallyRender from 'react-conditionally-render';

export interface ConnectToggleActionsProp {
  uiConfig: IUiConfig;
  issueKey: string;
  setFeature: Dispatch<SetStateAction<IFeatureToggle>>;
  toggleName: string;
}

const ConnectToggleActions = ({
  uiConfig,
  issueKey,
  setFeature,
  toggleName,
}: ConnectToggleActionsProp) => {
  const [createModal, setCreateModal] = useState(false);
  const [existingToggle, setExistingToggle] = useState(false);
  const toggleCreateModal = () => setCreateModal(!createModal);
  const toggleExisting = () => setExistingToggle(!existingToggle);
  return (
    <>
      <ConditionallyRender
        condition={!createModal && !existingToggle}
        show={
          <>
            <Button onClick={toggleCreateModal}>
              Create and connect feature toggle
            </Button>
            <Button onClick={toggleExisting}>
              Connect existing toggle
            </Button>
          </>
        }
      />

      <ConditionallyRender
        condition={createModal}
        show={
          <CreateToggle
            uiConfig={uiConfig}
            issueKey={issueKey}
            setFeature={setFeature}
            toggleCreateModal={toggleCreateModal}
          />
        }
      />

      <ConditionallyRender
        condition={existingToggle}
        show={
          <LinkExistingToggle
            uiConfig={uiConfig}
            issueKey={issueKey}
            setFeature={setFeature}
          />
        }
      />
    </>
  );
};

export default ConnectToggleActions;
