import { invoke } from '@forge/bridge';
import { useState, useEffect } from 'react';
import Badge from '@atlaskit/badge';
export interface FeatureToggleStatusParam {
    issueKey: string;
    toggleName: string;
    enabled: boolean;
}

const FeatureToggleStatus = ({issueKey, toggleName, enabled}: FeatureToggleStatusParam) => {
    const [featureUrl, setFeatureUrl] = useState('');
    useEffect(() => {
        const getData = async () => {
            await invoke<string>('getFrontendFeatureUrl', {toggleName}).then(setFeatureUrl);
        }
        getData();
    }, [toggleName])


    return (
        <>
            <p>
                <a href={featureUrl}>{toggleName}</a> is{' '}
                {enabled ? (
                    <Badge appearance='added'>
                        enabled
                    </Badge>
                ) : (
                    <Badge appearance='removed'>
                        disabled
                    </Badge>
                )}
            </p>
        </>
    );
};

export default FeatureToggleStatus;