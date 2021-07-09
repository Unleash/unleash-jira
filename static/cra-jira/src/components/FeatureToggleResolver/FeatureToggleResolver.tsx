import ConditionallyRender from 'react-conditionally-render';
import FeatureToggleStatus from '../FeatureToggleStatus/FeatureToggleStatus';
import { Dispatch, SetStateAction } from 'react';
import {
  IFeatureToggle,
  IUiConfig,
} from '../FeatureTogglePanel/FeatureTogglePanel';
import ConnectToggleActions from '../ConnectToggleActions/ConnectToggleActions';

export interface FeatureToggleResolverParams {
  toggleName: string;
  found: boolean;
  archived: boolean;
  enabled: boolean;
  issueKey: string;
  setFeature: Dispatch<SetStateAction<IFeatureToggle>>;
  uiConfig: IUiConfig;
}

const FeatureToggleResolver = ({
  toggleName,
  uiConfig,
  setFeature,
  found,
  archived,
  issueKey,
  enabled,
}: FeatureToggleResolverParams) => {
  return (
    <>
      <ConditionallyRender
        condition={found}
        show={
          <FeatureToggleStatus
            issueKey={issueKey}
            toggleName={toggleName}
            enabled={enabled}
          />
        }
        elseShow={
          <ConnectToggleActions
            uiConfig={uiConfig}
            issueKey={issueKey}
            setFeature={setFeature}
            toggleName={toggleName}
          />
        }
      />
    </>
  );
};

export default FeatureToggleResolver;
