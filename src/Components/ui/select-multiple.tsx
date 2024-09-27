"use client";

import { useEffect, useRef, useState } from "react";

export type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange?: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange?: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export function SelectMultiple({
  multiple,
  value,
  onChange,
  options,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    multiple ? onChange?.([]) : onChange?.(undefined);
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange?.(value.filter((o) => o !== option));
      } else {
        onChange?.([...value, option]);
      }
    } else {
      if (option !== value) onChange?.(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={
        "relative w-full border flex items-center gap-2 p-2 rounded-md focus:border-primary"
      }
    >
      <span className={"flex-grow flex gap-2 flex-wrap"}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className={
                  "flex items-center group gap-2 border rounded-sm bg-none outline hover:bg-primary focus:bg-primary"
                }
              >
                {v.label}
                <span
                  className={
                    "text-lg text-muted-foreground group-hover:text-primary group-focus:text-primary"
                  }
                >
                  &times;
                </span>
              </button>
            ))
          : value?.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={
          "bg-transparent text-muted-foreground border-none outline-none p-0 text-lg"
        }
      >
        &times;
      </button>
      <div className={"text-secondary-foreground items-center w-[1px]"}></div>
      <div
        className={
          "absolute translate-x-1/4 border border-t-secondary-foreground"
        }
      ></div>
      <ul
        className={`${"cursor-pointer absolute m-0 p-0 list-none border rounded-md top-full bg-card z-10"} ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${"px-2 py-1 cursor-pointer"} ${
              isOptionSelected(option)
                ? "bg-primary text-primary-foreground"
                : ""
            } ${
              index === highlightedIndex
                ? "bg-primary/70 text-primary-foreground"
                : ""
            }`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
