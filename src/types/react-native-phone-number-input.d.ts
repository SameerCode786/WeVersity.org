declare module 'react-native-phone-number-input' {
  import { Component } from 'react';
    import { TextInputProps, TextStyle, ViewStyle } from 'react-native';

  export interface PhoneInputProps {
    defaultValue?: string;
    defaultCode?: string;
    layout?: 'first' | 'second';
    onChangeFormattedText?: (text: string) => void;
    onChangeText?: (text: string) => void;
    containerStyle?: ViewStyle;
    textContainerStyle?: ViewStyle;
    textInputStyle?: TextStyle;
    codeTextStyle?: TextStyle;
    flagButtonStyle?: ViewStyle;
    countryPickerButtonStyle?: ViewStyle;
    textInputProps?: TextInputProps;
  }

  export default class PhoneInput extends Component<PhoneInputProps> {
    getNumberAfterPossiblyEliminatingZero?: () => { formattedNumber?: string } | null;
    getNumber?: () => { formattedNumber?: string } | null;
    isValidNumber?: () => boolean;
  }
}
