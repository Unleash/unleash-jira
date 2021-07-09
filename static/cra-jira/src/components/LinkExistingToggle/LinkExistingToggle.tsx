import {
    IFeatureToggle,
    IUiConfig,
} from '../FeatureTogglePanel/FeatureTogglePanel';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';

import styles from '../CreateToggle/CreateToggle.module.css';

export interface LinkExistingToggleProps {
    uiConfig: IUiConfig;
    setFeature: Dispatch<SetStateAction<IFeatureToggle>>;
    toggleExisting: () => void;
}
const LinkExistingToggle = ({
    uiConfig,
    setFeature,
    toggleExisting,
}: LinkExistingToggleProps) => {
    const [toggleName, setToggleName] = useState<string>('');
    const [featureNames, setFeatureNames] = useState<string[]>([]);

    useEffect(() => {
        const getData = async () => {
            await invoke<string[]>('fetchFeatureNames').then(setFeatureNames);
        };
        getData();
    });
    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log(toggleName);
                    toggleExisting();
                }}
            >
                <Select
                    options={featureNames.map((name) => ({
                        label: name,
                        value: name,
                    }))}
                    placeholder="Select feature toggle to connect to issue"
                    value={{ label: toggleName, value: toggleName }}
                    onChange={(v) => {
                        if (v) {
                            setToggleName(v.value);
                        }
                    }}
                    searchThreshold={5}
                />
                <div className={styles.buttonContainer}>
                    <Button onClick={toggleExisting}>Cancel</Button>
                    <Button appearance="primary" type="submit">
                        Link issue with toggle
                    </Button>
                </div>
            </form>
        </>
    );
};

export default LinkExistingToggle;
