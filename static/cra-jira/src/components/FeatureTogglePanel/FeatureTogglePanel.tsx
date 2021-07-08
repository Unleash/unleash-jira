import { invoke } from '@forge/bridge';
import { useEffect, useState } from 'react';
import ConditionallyRender from 'react-conditionally-render';
interface IFeatureTogglePanelProps {
  toggleName: string;
  issueKey: string;
}

interface IUiConfig {
  featureTypes: any;
  projects: any;
}

interface IFeatureToggle {
  enabled: boolean;
  found: boolean;
  errors: boolean;
  archived: boolean;
}

const FeatureTogglePanel = ({
  toggleName,
  issueKey,
}: IFeatureTogglePanelProps) => {
  const [uiConfig, setUiConfig] = useState({});
  const [feature, setFeature] = useState({ errors: true });

  useEffect(() => {
    const getData = async () => {
      await invoke<IUiConfig>('fetchUiConfig').then(setUiConfig);
      await invoke<IFeatureToggle>('fetchFeatureToggle').then(setFeature);
    };
    getData();
  }, []);

  console.log('UICONFIG', uiConfig);
  console.log('FEATURE', feature);
  console.log('ISSUEKEY', issueKey);
  console.log('TOGGLENAME', toggleName);

  return (
    <>
      <ConditionallyRender
        condition={Boolean(feature.errors)}
        show={<div>Some error here</div>}
        elseShow={<div>Nothing to show</div>}
      />
    </>
  );
};

export default FeatureTogglePanel;
