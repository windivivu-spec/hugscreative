import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement>;
export function Arrow({
  direction = "up-right",
  ...props
}: Props & { direction?: "up-right" | "right" | "left" | "down" | "up" }) {
  const paths = {
    "up-right": "M5 19 19 5M5 5h14v14",
    right: "M4 12h16m-7-7 7 7-7 7",
    left: "M20 12H4m7-7-7 7 7 7",
    down: "M12 4v16m-7-7 7 7 7-7",
    up: "M12 20V4m-7 7 7-7 7 7",
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[direction]} />
    </svg>
  );
}
export function Asterisk(props: Props) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      aria-hidden="true"
      {...props}
    >
      <path d="M24 2v44M5 13l38 22M5 35 43 13" />
    </svg>
  );
}
export function CloseIcon(props: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  );
}
