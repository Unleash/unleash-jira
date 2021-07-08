import './App.css';

import { useEffect, useState } from 'react';

import ConditionallyRender from 'react-conditionally-render';
import { invoke } from '@forge/bridge';
import FeatureTogglePanel from './components/FeatureTogglePanel/FeatureTogglePanel';

const App = () => {
  const [toggleName, setToggleName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [issueKey, setIssueKey] = useState('');

  useEffect(() => {
    const getData = async () => {
      /* NOTE TO DEVELOPERS: Using custom UI you can't do fetch calls or use 
      forge apis like storage unless you wrap it in functions that are defined in a 
      resolver. The resolver is placed in src/index.js and creates definitions that you
      can invoke using the invoke function from forge bridge. 
      This is a black box, expect pain.*/
      await invoke<string>('getApi').then(setApiUrl);
      await invoke<string>('getToggleName').then(setToggleName);
      await invoke<string>('getIssueKey').then(setIssueKey);
    };
    getData();
  }, []);

  console.log(toggleName, apiUrl);

  return (
    <>
      <ConditionallyRender
        condition={Boolean(apiUrl)}
        show={
          <FeatureTogglePanel
            toggleName={toggleName}
            issueKey={issueKey}
          />
        }
        elseShow={
          <p> You need to configure Unleash using the app's admin page</p>
        }
      />
    </>
  );
};

export default App;
