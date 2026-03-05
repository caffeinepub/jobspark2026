import { useEffect, useRef, useState } from "react";

interface SlotDigitProps {
  digit: string;
  isAnimating: boolean;
  delay: number;
}

function SlotDigit({ digit, isAnimating, delay }: SlotDigitProps) {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setSpinning(true);
        setTimeout(() => {
          setCurrentDigit(digit);
          setSpinning(false);
        }, 600);
      }, delay);
      return () => clearTimeout(timer);
    }
    setCurrentDigit(digit);
  }, [digit, isAnimating, delay]);

  if (!spinning) {
    return (
      <span className="inline-block tabular-nums font-display font-bold">
        {currentDigit}
      </span>
    );
  }

  return (
    <span
      className="inline-block overflow-hidden"
      style={{ height: "1.2em", verticalAlign: "middle" }}
    >
      <span
        className="inline-flex flex-col"
        style={{
          animation: "digit-cycle 0.6s ease-in-out forwards",
          willChange: "transform",
        }}
      >
        {digits.map((d) => (
          <span
            key={d}
            className="inline-block tabular-nums font-display font-bold"
            style={{ lineHeight: "1.2em", height: "1.2em" }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

interface SlotCounterProps {
  value: string;
  className?: string;
}

export default function SlotCounter({
  value,
  className = "",
}: SlotCounterProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setPrevValue(value);
      return;
    }
    if (value !== prevValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsAnimating(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  const chars = prevValue.split("");

  return (
    <span className={`inline-flex items-center gap-0 ${className}`}>
      {chars.map((char, charIdx) => {
        const isDigit = /\d/.test(char);
        const key = `char-${charIdx}`;
        if (!isDigit) {
          return (
            <span key={key} className="font-display font-bold">
              {char}
            </span>
          );
        }
        return (
          <SlotDigit
            key={key}
            digit={char}
            isAnimating={isAnimating}
            delay={charIdx * 60}
          />
        );
      })}
    </span>
  );
}
