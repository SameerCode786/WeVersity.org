import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export const CreateNewPasswordIllustration = ({ size = 160 }:{size?:number}) => (
  <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
    <Rect x="0" y="0" width="160" height="160" rx="20" fill="#FBF7FF" />
    <Path d="M80 48a20 20 0 0 0-20 20v8h40v-8a20 20 0 0 0-20-20z" fill="#EDE9FE" />
    <Rect x="48" y="84" width="64" height="44" rx="8" fill="#fff" stroke="#E5D8FE" />
    <Path d="M74 100v8a6 6 0 0 0 12 0v-8" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default CreateNewPasswordIllustration;
