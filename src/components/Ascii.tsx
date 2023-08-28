import React from "react";

interface Props {
  ascii: string;
}

export default function Ascii(props: Props) {
  return (
    <div className="flex justify-center">
      <div className="whitespace-pre-line font-mono text-xs leading-none">
        {props.ascii}
      </div>
    </div>
  );
}
