import {createSlice} from '@reduxjs/toolkit';

export interface TooltipState {
  playMusicTooltip: boolean;
}

const initialState: TooltipState = {
  playMusicTooltip: true,
};

export const tooltipSlice = createSlice({
  name: 'tooltip',
  initialState,
  reducers: {
    turnOffPlayMusicTooltip: state => {
      state.playMusicTooltip = false;
    },
  },
});

export const {turnOffPlayMusicTooltip} = tooltipSlice.actions;

export default tooltipSlice.reducer;
