
import React, { useEffect, useState } from 'react';

interface TextDecipherProps {
  text: string;
  className?: string;
  speed?: number;
}

const CHARS = "ABCDEFGH0123456789!@#$%&*+=-_";

export const TextDecipher: React.FC<TextDecipherProps> = ({ text, className = "", speed = 40 }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return text[index];
            }
            if (text[index] === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }

      iterations += 1 / 1.5;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`${className} inline-block whitespace-nowrap`}>
      {displayText}
    </span>
  );
};
