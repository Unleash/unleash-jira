import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState } from '@forge/ui';
import api from '@forge/api'; 
import unleash from './api/unleash';
import { unleashApiKey, unleashUrl } from './config';

const NOT_FOUND = 404;

const FeatureToggleComponent = ({ issueKey }) => {
  const [feature, setFeature] = useState(async () => {
      const res = await api.fetch(`${unleashUrl}/api/client/features/${issueKey}`, { headers: { 'Authorization': unleashApiKey }});
      if (res.ok) {
        const data = await res.json();
        if (data.enabled) {
          return "Feature Toggle is enabled"
        } else {
          return "Feature Toggle is disabled";
        }
      } else if (res.status === NOT_FOUND) {
          return "Could not find feature toggle";
      } else {
        return "Could not reach Unleash API";
      }
   });
  return (
    <Fragment>
      <Text>{feature}</Text>
    </Fragment>
  )
}

const App = () => {
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  return (
    <Fragment>
       <FeatureToggleComponent issueKey={issueKey} />
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
