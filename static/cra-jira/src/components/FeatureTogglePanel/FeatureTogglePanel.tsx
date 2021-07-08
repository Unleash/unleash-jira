import { useEffect, useState } from 'react';
import ConditionallyRender from 'react-conditionally-render';
import { unleash } from '../../api';

interface IFeatureTogglePanelProps {
  toggleName: string;
  issueKey: string;
}

const FeatureTogglePanel = ({
  toggleName,
  issueKey,
}: IFeatureTogglePanelProps) => {
  const [uiConfig, setUiConfig] = useState({});
  const [feature, setFeature] = useState({ errors: true });

  useEffect(() => {
    // const getData = async () => {
    //   const uiConfig = await unleash.fetchUiBootstrap();
    //   const feature = await unleash.fetchFeatureToggle(toggleName);
    //   setUiConfig(uiConfig || {});
    //   setFeature(feature);
    // };
    // getData();
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
