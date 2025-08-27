import React, { FC } from "react";
import { View } from "react-native";
// import LottieView from "lottie-react-native";
import { LoaderProps } from "./model/types";

// import successAnimation from "./animations/success.json";

interface SuccessAnimationProps extends LoaderProps {
  startFrame?: number;
  endFrame?: number;
}

export const SuccessAnimation: FC<SuccessAnimationProps> = ({
  size = 250,
  style,
  isVisible = true,
  startFrame = 20,
  endFrame = 100,
}) => {
  // const lottieRef = useRef<LottieView>(null);

  // const playAnimation = () => {
  //   lottieRef.current?.reset();

  //   setTimeout(() => {
  //     lottieRef.current?.play(startFrame, endFrame);
  //   }, 50);
  // };

  // useEffect(() => {
  //   if (isVisible) playAnimation();
  // }, [isVisible, startFrame, endFrame]);

  // if (!isVisible) return null;

  return (
    <View
      style={[
        {
          width: size,
          height: size / 1.5,
          transform: [{ translateY: -size / 6 }],
          marginHorizontal: "auto",
        },
        style,
      ]}
    >
      {/* <LottieView
        ref={lottieRef}
        source={successAnimation}
        style={{ width: size, height: size }}
        autoPlay={false}
        loop={false}
      /> */}
    </View>
  );
};
