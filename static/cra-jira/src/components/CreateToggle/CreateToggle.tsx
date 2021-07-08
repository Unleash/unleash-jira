import { IFeatureToggle, IUiConfig } from "../FeatureTogglePanel/FeatureTogglePanel";
import { Dispatch, SetStateAction } from "react";
import Form from "@atlaskit/form";
import { invoke } from "@forge/bridge";
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
    const projects = uiConfig.projects.map(project => ({label: project.name, value: project.id}));
    const featureTypes = uiConfig.featureTypes.map(featureType => ({label: featureType.name, value: featureType.id}))
    return (<>
        <p>The feature toggle for {issueKey} does not exist.</p>
        <Form onSubmit={(values, form, callback) => {
            console.log(values);
            invoke('createFeatureToggle', {payload: { values }})
        }}>
            {({formProps, dirty, submitting}) => (
                <form {...formProps}>
                    <Select placeholder='Feature type' name='project' options={projects} />
                    <Select placeholder={'Toggle type'} name='type' options={featureTypes} />
                    <label for='enabled'>Enable/Disable toggle</label>
                    <Toggle label='Enable feature' name='enabled' defaultChecked={false}/>
                    <Textfield label='Toggle name' name='name' isRequired={true} />
                    <TextArea name='description' placeholder={`If you'd like to add a description do so here`}/>
                    <input type='submit' value='Create toggle' />
                </form>
            )}
        </Form>
    </>);
};

export default CreateToggle;