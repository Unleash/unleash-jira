import { invoke } from '@forge/bridge';
import { useEffect, useState } from 'react';
import ConditionallyRender from 'react-conditionally-render';
import FeatureToggleResolver from "../FeatureToggleResolver/FeatureToggleResolver";

interface IFeatureTogglePanelProps {
    toggleName: string;
    issueKey: string;
}

export interface ISelectable {
    id: string;
    name: string;
}

export interface IUiConfig {
    featureTypes: ISelectable[];
    projects: ISelectable[];
}

export interface IFeatureToggle {
    enabled: boolean;
    found: boolean;
    errors: boolean;
    archived: boolean;
}

const FeatureTogglePanel = ({
                                toggleName,
                                issueKey,
                            }: IFeatureTogglePanelProps) => {
    const [uiConfig, setUiConfig] = useState<IUiConfig>({ featureTypes: [], projects: [] });
    const [feature, setFeature] = useState<IFeatureToggle>({enabled: false, found: false, archived: false, errors: true});

    useEffect(() => {
        const getData = async () => {
            await invoke<IFeatureToggle>('fetchFeatureToggle', {toggleName}).then(setFeature);
        }
        if (toggleName) {
            getData();
        }
    }, [toggleName])
    useEffect(() => {
        const getData = async () => {
            await invoke<IUiConfig>('fetchUiConfig').then(setUiConfig);
        };
        getData();
    }, []);

    return (
        <>
            <ConditionallyRender
                condition={Boolean(feature.errors)}
                show={<div>Some error here</div>}
                elseShow={<FeatureToggleResolver setFeature={setFeature}
                                                 toggleName={toggleName} issueKey={issueKey}
                                                 archived={feature.archived}
                                                 enabled={feature.enabled} found={feature.found}
                                                 uiConfig={uiConfig}></FeatureToggleResolver>}
            />
        </>
    );
};

export default FeatureTogglePanel;
