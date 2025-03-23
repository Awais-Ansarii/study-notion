import React from "react";
import CTABtn from "./Btn";
import HighlightedText from "./HighlightedText";
const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctaBtn1,
  ctaBtn2,
  codeBlock,
  backgroundGradient,
  codeColor,
}) => {
  return <div className={`flex ${position} justify-between items-start my-10 gap-10`}>CodeBlocks</div>;
};

export default CodeBlocks;
