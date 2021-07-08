import { IFeatureToggle, IUiConfig } from "../FeatureTogglePanel/FeatureTogglePanel";
import { Dispatch, SetStateAction } from "react";

export interface LinkExistingToggleProps {
    uiConfig : IUiConfig;
    issueKey: string;
    toggleName: string;
    setFeature: Dispatch<SetStateAction<IFeatureToggle>>
}
const LinkExistingToggle = ({ uiConfig, issueKey, toggleName, setFeature }: LinkExistingToggleProps) => {
    return (<><p>Hello world</p></>);
}

export default LinkExistingToggle;