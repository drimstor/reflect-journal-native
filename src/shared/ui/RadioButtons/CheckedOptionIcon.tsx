import { Circle, ClipPath, Defs, G, Rect, Svg } from 'react-native-svg';

const CheckedOptionIcon = () => {
  return (
    <Svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
      <G clip-path='url(#clip0_1261_5825)'>
        <Circle cx='7' cy='7' r='6.25' stroke='#50B150' stroke-width='1.5' />
        <Circle cx='7' cy='7' r='4' fill='#50B150' />
      </G>
      <Defs>
        <ClipPath id='clip0_1261_5825'>
          <Rect width='14' height='14' fill='white' />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CheckedOptionIcon;
