import type { SVGProps } from 'react';

export const Info = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
    <path
      d='M12 7q-.825 0-1.412-.587T10 5t.588-1.412T12 3t1.413.588T14 5t-.587 1.413T12 7m-1.5 14V9h3v12z'
      fill='currentColor'
    />
  </svg>
);
