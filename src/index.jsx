import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext } from '@forge/ui';

const unleashData = (issueKey) => {
}

const App = () => {
  const ctx = useProductContext()



  return (
    <Fragment>
      <Text>Hello world! ctx.unleash.url + ${issueKey}</Text>
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
