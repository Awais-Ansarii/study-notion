import React from 'react'

const HighlightedText = ({ text, color=null }) => {
  return (
    <span className={`   font-bold text-blue-200`}>
      {" "}{text}
    </span>
  )
}

export default HighlightedText
