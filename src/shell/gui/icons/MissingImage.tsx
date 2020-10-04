import * as React from "react";

// tslint:disable:max-line-length Not appropriate for SVG file content.

/** The icon displayed in place of a missing image (31 x 32 pixels). */
export class MissingImage extends React.PureComponent<React.SVGProps<SVGSVGElement>> {
  public static width = 30.99;
  public static height = 32;

  public render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={MissingImage.width}
        height={MissingImage.height}
        viewBox="0 0 24.38 25.3"
      >
        <path
          d="M2.94 0A2.94 2.94 0 0 0 0 2.94v9.8-2.07l2.34-2.32L5.62 13l4.9-4.65 3.53 4.6 4.67-4.6 3.26 4.64 2.39-2.32v3.47l-2.6 2.53-3.05-4.64-5.14 4.64-3.06-4.64-5.13 4.64-3.05-4.64L0 14.13v8.23a2.94 2.94 0 0 0 2.94 2.94h18.5a2.94 2.94 0 0 0 2.94-2.94V2.94A2.94 2.94 0 0 0 21.44 0z"
          fill="#01f0ff"
          fillOpacity=".5"
        />
        <path
          d="M5.62 13l4.34 2.86L16.6 5l-3.84-1.86-.25.28-.4.12-.95.4-5.34 8.63z"
          fill="#6c6c52"
          fillOpacity=".66"
          stroke="#040503"
          strokeWidth=".04"
        />
        <path
          d="M9.14 17.26l.82-1.4 4.23 1.85-.86.24-.2-.22-.5.15-.37.02-1.05.4-.73-.47-.58-.41z"
          fill="#8c8c69"
          stroke="#000"
          strokeWidth=".04"
        />
        <path
          d="M5.62 13l4.34 2.86-.82 1.4-1.12-1.13-1.33-.98-.5.07-.28-.2z"
          fill="#78785b"
          stroke="#000"
          strokeWidth=".04"
        />
        <path d="M2.68 21.44l4.01-6.29 1.33.98 1.12 1.13.76.16.58.41-3 4.93-1.5.2-1.2-.27-1.02-.45-.46-.48z" />
        <path
          d="M14.2 17.71l6.5-9.66-3.42-3.21-.68.16-6.64 10.86z"
          fill="#818152"
          fillOpacity=".66"
          stroke="#000"
          strokeWidth=".04"
        />
        <path
          d="M17.28 4.84l1.1-2.4.77-1.06-.73.06-5.28 1.53-.38.17L16.6 5z"
          fill="#7b7b5d"
          fillOpacity=".66"
          stroke="#000"
          strokeWidth=".04"
        />
        <path
          d="M19.15 1.38l.31 1.72.27.52.65 2.17.32 2.26-3.42-3.21 1.1-2.4z"
          fill="#909067"
          fillOpacity=".66"
          stroke="#000"
          strokeWidth=".04"
        />
      </svg>
    );
  }
}
