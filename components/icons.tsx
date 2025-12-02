import Svg, { Circle, Path, Rect } from "react-native-svg";

// 🔹 Facebook Icon - Official Blue
export const FacebookIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" 
      fill="#1877F2"
    />
  </Svg>
);

// 🔹 Google Icon - Official Multi-color
export const GoogleIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4" />
  </Svg>
);

// 🔹 Apple Icon - Official Black
export const AppleIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17.05 15.41c-.14.19-1.32 1.63-2.99 1.63-1.65 0-2.14-.83-3.87-.83-1.72 0-2.2.82-3.85.82-1.68 0-2.93-1.59-3.07-1.76-.31-.41-.47-.94-.47-1.5 0-.79.34-1.53.95-2.06.7-.61 1.66-.77 2.5-.77.83 0 1.67.16 2.38.16.7 0 1.55-.16 2.37-.16.84 0 1.9.23 2.73.99.66.6 1.03 1.43 1.03 2.29 0 .84-.36 1.65-1.01 2.22zm-2.54-8.35c.41-.51.72-1.24.72-2.02 0-.13-.01-.25-.03-.37-.79.03-1.7.51-2.24 1.13-.44.5-.84 1.26-.84 2.03 0 .13.02.25.03.38.06.01.14.02.23.02.69 0 1.54-.47 2.19-1.09z" fill="#000" />
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
