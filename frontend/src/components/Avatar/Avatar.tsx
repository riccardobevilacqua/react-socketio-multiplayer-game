import React, { useRef, useEffect } from 'react';
import { update as jdenticonUpdate } from 'jdenticon';

export interface AvatarProps {
  text: string;
  size?: string | number;
}

export const Avatar: React.FunctionComponent<AvatarProps> = ({
  text,
  size = 48
}) => {
  const icon = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    jdenticonUpdate(icon.current as string | Element, text);
  }, [text]);

  return (
    <>
      <svg ref={icon} data-jdenticon-value={text} width={size.toString()} height={size.toString()} />
    </>
  );
};
