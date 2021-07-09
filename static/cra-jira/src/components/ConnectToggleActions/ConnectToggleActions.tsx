import {
    IFeatureToggle,
    IUiConfig,
} from '../FeatureTogglePanel/FeatureTogglePanel';
import { invoke } from '@forge/bridge';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Button from '@atlaskit/button/standard-button';
import CreateToggle from '../CreateToggle/CreateToggle';
import LinkExistingToggle from '../LinkExistingToggle/LinkExistingToggle';
import ConditionallyRender from 'react-conditionally-render';
import Badge from '@atlaskit/badge';

import SectionMessage from '@atlaskit/section-message';

export interface ConnectToggleActionsProp {
    uiConfig: IUiConfig;
    setFeature: Dispatch<SetStateAction<IFeatureToggle>>;
    toggleName: string;
    enabled: boolean;
}

const ConnectToggleActions = ({
    uiConfig,
    setFeature,
    toggleName,
    enabled,
}: ConnectToggleActionsProp) => {
    const [createModal, setCreateModal] = useState(false);
    const [existingToggle, setExistingToggle] = useState(false);
    const [success, setSuccess] = useState('');
    const toggleCreateModal = () => setCreateModal(!createModal);
    const toggleExisting = () => setExistingToggle(!existingToggle);

    const [featureUrl, setFeatureUrl] = useState('');

    useEffect(() => {
        const getData = async () => {
            await invoke<string>('getFrontendFeatureUrl', { toggleName }).then(
                setFeatureUrl
            );
        };
        getData();
    }, [toggleName]);

    return (
        <>
            <ConditionallyRender
                condition={Boolean(success)}
                show={
                    <SectionMessage
                        appearance="success"
                        title="Successfully created feature toggle"
                    >
                        {success}
                    </SectionMessage>
                }
            />

            <ConditionallyRender
                condition={!createModal && !existingToggle}
                show={
                    <>
                        <p>
                            <a href={featureUrl}>{toggleName}</a> is{' '}
                            {enabled ? (
                                <Badge appearance="added">enabled</Badge>
                            ) : (
                                <Badge appearance="removed">disabled</Badge>
                            )}
                        </p>

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
                        setFeature={setFeature}
                        toggleCreateModal={toggleCreateModal}
                        setSuccess={setSuccess}
                    />
                }
            />

            <ConditionallyRender
                condition={existingToggle}
                show={
                    <LinkExistingToggle
                        uiConfig={uiConfig}
                        setFeature={setFeature}
                        toggleExisting={toggleExisting}
                    />
                }
            />
        </>
    );
};

export default ConnectToggleActions;
