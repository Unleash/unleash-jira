import { Dispatch, SetStateAction, useState } from 'react';
import {
  IFeatureToggle,
  IUiConfig,
} from '../FeatureTogglePanel/FeatureTogglePanel';

import Select from '@atlaskit/select';
import Toggle from '@atlaskit/toggle';
import Textfield from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import Button from '@atlaskit/button';

import styles from './CreateToggle.module.css';

export interface CreateToggleProps {
  uiConfig: IUiConfig;
  issueKey: string;
  setFeature: Dispatch<SetStateAction<IFeatureToggle>>;
  toggleCreateModal: () => void;
}

const CreateToggle = ({
  uiConfig,
  issueKey,
  setFeature,
  toggleCreateModal,
}: CreateToggleProps) => {
  const [formData, setFormData] = useState({
    enabled: false,
    project: { label: 'Default', value: 'default' },
    type: { label: 'Release', value: 'release' },
    name: '',
    description: '',
  });
  const projects = uiConfig.projects.map((project: any) => ({
    label: project.name,
    value: project.id,
  }));
  const featureTypes = uiConfig.featureTypes.map((featureType: any) => ({
    label: featureType.name,
    value: featureType.id,
  }));
  return (
    <>
      <h3>Create feature toggle</h3>
      <p>The feature toggle for {issueKey} does not exist.</p>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          console.log(formData);
          toggleCreateModal();
        }}
      >
        <label className={styles.label}>
          Project
          <Select
            placeholder='Feature type'
            name='project'
            options={projects}
            value={formData.project}
            onChange={(selectData) => {
              if (selectData) {
                setFormData({ ...formData, project: selectData });
              }
            }}
          />
        </label>

        <label className={styles.label}>
          Toggle type
          <Select
            placeholder={'Toggle type'}
            name='type'
            options={featureTypes}
            value={formData.type}
            onChange={(selectData) => {
              if (selectData) {
                setFormData({ ...formData, type: selectData });
              }
            }}
          />
        </label>
        <label htmlFor='enabled'>Enable/Disable toggle</label>
        <Toggle
          label='Enable feature'
          size='large'
          name='enabled'
          isChecked={formData.enabled}
          onChange={(toggleData) => {
            setFormData({
              ...formData,
              enabled: toggleData.target.checked,
            });
          }}
        />
        <Textfield
          label='Toggle name'
          name='name'
          isRequired={true}
          onChange={(nameChange) => {
            setFormData({
              ...formData,
              name: nameChange.currentTarget.value,
            });
          }}
        />
        <TextArea
          name='description'
          placeholder={`If you'd like to add a description do so here`}
          onChange={(descriptionChange) => {
            setFormData({
              ...formData,
              description: descriptionChange.target.value,
            });
          }}
        />
        <Button type='submit' value='Create toggle' />
      </form>
    </>
  );
};

export default CreateToggle;
