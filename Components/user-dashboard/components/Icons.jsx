import logo from "../../../src/icons/logo.svg";
import { useTheme } from "./../../../src/ThemeContext";
import logo_dark from "/logo_dark.png";
import logo_light from "/logo_light.png";

export const IconLogo = () => <img src={logo} alt="Logo" />;

export const IconUserProfileDefault = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="50"
    fill="none"
    viewBox="0 0 53 53"
  >
    <g clipPath="url(#a)">
      <path
        fill="#fff"
        d="M36.132 22.993a9.841 9.841 0 0 1-9.854 9.854 9.841 9.841 0 0 1-9.854-9.854 9.841 9.841 0 0 1 9.854-9.854 9.841 9.841 0 0 1 9.854 9.854Z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M52.556 26.278c0 14.518-11.76 26.278-26.278 26.278C11.759 52.556 0 40.796 0 26.278 0 11.759 11.76 0 26.278 0c14.518 0 26.278 11.76 26.278 26.278ZM13.139 45.165c.525-.874 5.617-9.033 13.106-9.033 7.456 0 12.58 8.179 13.106 9.033a22.928 22.928 0 0 0 9.887-18.887c0-12.712-10.281-22.993-22.993-22.993-12.712 0-22.993 10.28-22.993 22.993a22.941 22.941 0 0 0 9.887 18.887Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h52.556v52.556H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const IconSearch = () => {
  const { isDarkMode } = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 31 29"
    >
      <path
        fill={isDarkMode ? "#eee" : "#333"}
        d="M29.3 29 17.673 17.917a10.337 10.337 0 0 1-3.202 1.75c-1.207.413-2.42.62-3.64.62-2.972 0-5.488-.981-7.548-2.944C1.225 15.381.195 12.983.195 10.15c0-2.835 1.029-5.234 3.086-7.199C5.338.986 7.853.002 10.825 0c2.973-.002 5.49.98 7.553 2.945 2.062 1.966 3.093 4.365 3.093 7.198 0 1.23-.229 2.42-.686 3.57-.456 1.15-1.056 2.135-1.8 2.953l11.625 11.08L29.3 29ZM10.834 18.515c2.463 0 4.542-.808 6.238-2.425 1.695-1.616 2.543-3.6 2.543-5.948 0-2.35-.848-4.332-2.543-5.947-1.696-1.616-3.775-2.424-6.238-2.425-2.463-.001-4.543.807-6.24 2.425-1.697 1.617-2.544 3.6-2.543 5.947.001 2.347.849 4.329 2.543 5.947 1.695 1.617 3.774 2.426 6.238 2.424"
      />
    </svg>
  );
};

export const IconDropDown = () => {
  const { isDarkMode } = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="6"
      fill="none"
      viewBox="0 0 8 6"
    >
      <path fill={isDarkMode ? "white" : "black"} d="M4 5.5 8 0H0l4 5.5Z" />
    </svg>
  );
};

export const IconPlusFill = () => {
  const { isDarkMode } = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
    >
      <path
        fill={isDarkMode ? "white" : "black"}
        d="M16.5 0h-15A1.5 1.5 0 0 0 0 1.5v15A1.5 1.5 0 0 0 1.5 18h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 16.5 0Zm-2.25 9.75h-4.5v4.5a.75.75 0 1 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5a.75.75 0 0 1 1.5 0v4.5h4.5a.75.75 0 1 1 0 1.5Z"
      />
    </svg>
  );
};

export const IconPlus = () => {
  const { isDarkMode } = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
    >
      <path
        fill={isDarkMode ? "#B7950B" : "#D4AF37"}
        d="M13 8H8v5a1 1 0 1 1-2 0V8H1a1 1 0 0 1 0-2h5V1a1 1 0 0 1 2 0v5h5a1 1 0 1 1 0 2Z"
      />
    </svg>
  );
};

export const IconVerticalOptions = () => {
  const { isDarkMode } = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="16"
      fill="none"
      viewBox="0 0 4 16"
    >
      <path
        fill={isDarkMode ? "white" : "black"}
        d="M2 16c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 0 1 0 14c0-.55.195-1.021.588-1.412A1.94 1.94 0 0 1 2 12a1.92 1.92 0 0 1 1.413.588c.393.393.589.864.587 1.412a1.95 1.95 0 0 1-.587 1.413A1.9 1.9 0 0 1 2 16Zm0-6c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 0 1 0 8c0-.55.195-1.021.588-1.412A1.94 1.94 0 0 1 2 6a1.92 1.92 0 0 1 1.413.588c.393.393.589.864.587 1.412a1.95 1.95 0 0 1-.587 1.413A1.9 1.9 0 0 1 2 10Zm0-6C1.45 4 .98 3.804.588 3.413A1.93 1.93 0 0 1 0 2C0 1.45.195.979.588.588A1.94 1.94 0 0 1 2 0a1.92 1.92 0 0 1 1.413.588C3.806.981 4.002 1.452 4 2a1.95 1.95 0 0 1-.587 1.413A1.9 1.9 0 0 1 2 4Z"
      />
    </svg>
  );
};

export const IconUserProfileClose = () => (
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.1785 20L0 18.8776L9.3215 10L0 1.12238L1.1785 0L10.5 8.87761L19.8215 0L21 1.12238L11.6785 10L21 18.8776L19.8215 20L10.5 11.1224L1.1785 20Z"
      fill="black"
    />
  </svg>
);
