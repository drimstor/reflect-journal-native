import { FC } from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native';
import CheckedOptionIcon from './CheckedOptionIcon';
import { styles } from './RadioButtons.styles';

interface RadioButtonProps {
  checked: boolean;
  onPress: () => void;
}

const RadioButton: FC<RadioButtonProps> = ({ checked, onPress }) => {
  return (
    <Pressable onPress={onPress} style={{ padding: 10 }}>
      {checked ? <CheckedOptionIcon /> : <View style={styles.optionUnchecked}></View>}
    </Pressable>
  );
};

export default RadioButton;
