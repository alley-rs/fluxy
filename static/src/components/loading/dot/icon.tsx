const DotLoadingIcon = () => (
  <svg height="1em" viewBox="0 0 100 40" style="vertical-align: -0.125em;">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-100.000000, -71.000000)">
        <g transform="translate(95.000000, 71.000000)">
          <g transform="translate(5.000000, 0.000000)">
            <rect fill="currentColor" x="20" y="16" width="8" height="8" rx="2">
              <animate
                attributeName="y"
                from="16"
                to="16"
                dur="2s"
                begin="0s"
                repeatCount="indefinite"
                values="16; 6; 26; 16; 16"
                keyTimes="0; 0.1; 0.3; 0.4; 1"
              ></animate>
            </rect>
            <rect fill="currentColor" x="46" y="16" width="8" height="8" rx="2">
              <animate
                attributeName="y"
                from="16"
                to="16"
                dur="2s"
                begin="0.2s"
                repeatCount="indefinite"
                values="16; 6; 26; 16; 16"
                keyTimes="0; 0.1; 0.3; 0.4; 1"
              ></animate>
            </rect>
            <rect fill="currentColor" x="72" y="16" width="8" height="8" rx="2">
              <animate
                attributeName="y"
                from="16"
                to="16"
                dur="2s"
                begin="0.4s"
                repeatCount="indefinite"
                values="16; 6; 26; 16; 16"
                keyTimes="0; 0.1; 0.3; 0.4; 1"
              ></animate>
            </rect>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default DotLoadingIcon;
