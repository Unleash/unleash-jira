import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
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
import { invoke } from '@forge/bridge';

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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      invoke('createFeatureToggle', { toggleData: formData });
      toggleCreateModal();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h3 className={styles.formTitle}>Create feature toggle</h3>
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.label}>
          <span className={styles.labelText}>Project</span>
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
          <span className={styles.labelText}>Toggle type</span>
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

        <label className={styles.label}>
          <span className={styles.labelText}>Toggle status</span>

          <div className={styles.toggleContainer}>
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
            <span>
              Toggle is {formData.enabled ? 'enabled' : 'disabled'}
            </span>
          </div>
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>Toggle name</span>
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
        </label>

        <TextArea
          name='description'
          placeholder={`Add optional feature toggle description`}
          onChange={(descriptionChange) => {
            setFormData({
              ...formData,
              description: descriptionChange.target.value,
            });
          }}
        />
        <div className={styles.buttonContainer}>
          <Button onClick={toggleCreateModal}>Cancel</Button>
          <Button appearance='primary' type='submit'>
            Create feature toggle
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateToggle;
