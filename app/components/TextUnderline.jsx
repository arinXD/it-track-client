"use client"

const TextUnderline = ({ children, className }) => {
     return (
          <span className={`${className} inline-block underline decoration-dotted underline-offset-4`}>  {children}  </span>
     )
}

export default TextUnderline