import { IFeatureToggle, IUiConfig } from "../FeatureTogglePanel/FeatureTogglePanel";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Textfield from "@atlaskit/textfield";
import { invoke } from "@forge/bridge";
import { PopupSelect } from "@atlaskit/select";

export interface LinkExistingToggleProps {
    uiConfig : IUiConfig;
    issueKey: string;
    setFeature: Dispatch<SetStateAction<IFeatureToggle>>
}
const LinkExistingToggle = ({ uiConfig, issueKey, setFeature }: LinkExistingToggleProps) => {
    const [toggleName, setToggleName] = useState<string>('');
    const [featureNames, setFeatureNames] = useState<string[]>([]);

    const onChange = (f) => {
        setToggleName(f.value);
    }
    const defaults = {
        placeholder: 'Choose an existing Feature toggle',
        onChange,
    };

    useEffect(() => {
        const getData = async () => {
            await invoke<string[]>('fetchFeatureNames').then(setFeatureNames);
        }
        getData();
    })

    return (<>
        <form onSubmit={(e) => {
            e.preventDefault();
            console.log(toggleName);
        }}>
            <PopupSelect
                options={featureNames.map(name => ({ label: name, value: name }))}
                target={({ isOpen, ...triggerProps }) => (
                    <button {...triggerProps}>Select existing toggle</button>
                )}
                value={({ label: toggleName, value: toggleName })}
                onChange={(v) => {
                    if (v) { setToggleName(v.value) }
                }}
                searchThreshold={5}
            />
            <input type='submit' value='Link toggle' />
        </form>
    </>);
}

export default LinkExistingToggle;