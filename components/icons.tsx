import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// 🔹 Existing Icons (Your Original Code)
export const FacebookIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" fill="#1877F2" />
  </Svg>
);

export const GoogleIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.25 17.21 15.81 18.11V21.09H19.62C21.85 19.09 23.49 16.04 23.49 12.275Z"
      fill="#4285F4"
    />
    <Path
      d="M12 24C15.24 24 17.965 22.935 19.63 21.09L15.81 18.11C14.73 18.83 13.355 19.24 12 19.24C8.81 19.24 6.115 17.09 5.155 14.21H1.22V17.26C2.985 20.76 6.585 24 12 24Z"
      fill="#34A853"
    />
    <Path
      d="M5.155 14.21C4.9 13.46 4.755 12.655 4.755 11.825C4.755 10.995 4.9 10.19 5.155 9.44V6.39H1.22C0.445 7.96 0 9.815 0 11.825C0 13.835 0.445 15.69 1.22 17.26L5.155 14.21Z"
      fill="#FBBC05"
    />
    <Path
      d="M12 4.41C13.77 4.41 15.355 5.02 16.605 6.205L20.03 2.78C17.965 0.855 15.24 0 12 0C6.585 0 2.985 3.24 1.22 6.39L5.155 9.44C6.115 6.56 8.81 4.41 12 4.41Z"
      fill="#EA4335"
    />
  </Svg>
);

export const AppleIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.8-1.02 1.29 0 3.34.69 4.24 2.1-3.65 1.78-3.06 6.68.52 8.16-.32.8-.76 1.6-1.64 2.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      fill={color}
    />
  </Svg>
);

// Eye icon for show/hide password
export const EyeIcon = ({ size = 20, color = "#9ca3af" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.5} />
  </Svg>
);

// Checkbox icons
export const CheckedCheckboxIcon = ({ size = 20, color = "#7C3AED" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="4" fill={color} />
    <Path d="M7 12l3 3 7-7" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const UncheckedCheckboxIcon = ({ size = 20, color = "#9ca3af" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="4" stroke={color} strokeWidth={1.5} />
  </Svg>
);


export const BackArrowIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const EmailIcon = ({ size = 20, color = "#9ca3af" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18v12H3z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    <Path d="M21 6l-9 7L3 6" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
  </Svg>
);

export const PasswordIcon = ({ size = 20, color = "#9ca3af" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 11V9a3 3 0 0 1 6 0v2" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const UserIcon = ({ size = 20, color = "#9ca3af" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={1.5} />
  </Svg>
);

// 🔹 New Icon for Forgot Password Screen (Message Icon)
export const SmsIcon = ({ size = 22, color = "#7C3AED" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.5" />
    <Path d="M3 6l9 7 9-7" stroke={color} strokeWidth="1.5" />
  </Svg>
);
