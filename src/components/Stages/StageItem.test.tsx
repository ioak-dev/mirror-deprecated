import * as React from 'react';
import { shallow } from 'enzyme';

import StageItem from './StageItem';

const stage = {
  _id: '5e04ae30d9e3d3bc0b7f8a1e',
  name: 'stage 1',
};

describe('StageItem component interaction', () => {
  const mockFn = jest.fn();
  let mockEditStageFunction;
  let mockDeleteStageFunction;

  beforeEach(() => {
    mockEditStageFunction = jest.fn();
    mockDeleteStageFunction = jest.fn();
  });

  it('should load when initialized', () => {
    const wrapper = shallow(
      <StageItem
        id="1"
        index={0}
        editStage={mockFn}
        confirmDeleteStage={mockFn}
        stage={stage}
      />
    );
    expect(wrapper.find('.stage-record')).toHaveLength(1);
  });

  it('should call edit article function when edit icon is clicked', () => {
    const wrapper = shallow(
      <StageItem
        id="1"
        index={0}
        editStage={mockEditStageFunction}
        confirmDeleteStage={mockFn}
        stage={stage}
      />
    );
    wrapper.find('[data-test="stage-edit"]').simulate('click');
    expect(mockEditStageFunction).toBeCalledTimes(1);
  });

  it('should call delete article function when delete icon is clicked', () => {
    const wrapper = shallow(
      <StageItem
        id="1"
        index={0}
        editStage={mockFn}
        confirmDeleteStage={mockDeleteStageFunction}
        stage={stage}
      />
    );
    wrapper.find('[data-test="stage-delete"]').simulate('click');
    expect(mockDeleteStageFunction).toBeCalledTimes(1);
  });
});
