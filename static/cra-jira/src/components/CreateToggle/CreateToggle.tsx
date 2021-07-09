import { IFeatureToggle, IUiConfig } from "../FeatureTogglePanel/FeatureTogglePanel";
import { Dispatch, SetStateAction, useState } from "react";
import Select from '@atlaskit/select';
import Toggle from "@atlaskit/toggle";
import Textfield from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';

export interface CreateToggleProps {
    uiConfig: IUiConfig;
    issueKey: string;
    setFeature: Dispatch<SetStateAction<IFeatureToggle>>;
}

const CreateToggle = ({uiConfig, issueKey, setFeature}: CreateToggleProps) => {
    const [formData, setFormData] = useState({ enabled: false, project: {label: 'Default', value: 'default' }, type: { label: 'Release', value: 'release' }, name: '', description: ''});
    const projects = uiConfig.projects.map(project => ({label: project.name, value: project.id}));
    const featureTypes = uiConfig.featureTypes.map(featureType => ({label: featureType.name, value: featureType.id}))
    return (<>
    <p>The feature toggle for {issueKey} does not exist.</p>
    <form onSubmit={(event) => {
        event.preventDefault();
        console.log(formData);
    }}>
        <Select placeholder='Feature type' name='project' options={projects} value={formData.project} onChange={(selectData) => {
            if (selectData) {
                setFormData({...formData, project: selectData})
            }
        }}/>
        <Select placeholder={'Toggle type'} name='type' options={featureTypes} value={formData.type}
                onChange={(selectData) => {
                    if (selectData) {
                        setFormData({...formData, type: selectData})
                    }
        }
        }/>
        <label for='enabled'>Enable/Disable toggle</label>
        <Toggle label='Enable feature' name='enabled' isChecked={formData.enabled} onChange={(toggleData) => {
            setFormData({...formData, enabled: toggleData.target.checked})
        }}
        />
        <Textfield label='Toggle name' name='name' isRequired={true} onChange={(nameChange) => {
            setFormData({...formData, name: nameChange.currentTarget.value })
        }
        }/>
        <TextArea name='description' placeholder={`If you'd like to add a description do so here`} onChange={(descriptionChange) => {
            setFormData({ ...formData, description: descriptionChange.target.value })
        }
        }/>
        <input type='submit' value='Create toggle'/>
    </form>
</>)
    ;
};

export default CreateToggle;