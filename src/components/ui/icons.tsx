import type { SVGProps } from "react";

export type IconComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

function BaseIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

export const HomeIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </BaseIcon>
);

export const UsersIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M13 20a4 4 0 0 1 8 0" />
  </BaseIcon>
);

export const FileIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h8" />
  </BaseIcon>
);

export const PillIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="m10.5 13.5 7-7a4 4 0 1 1 5.7 5.7l-7 7" />
    <path d="m2.8 21.2 7-7a4 4 0 1 1 5.7 5.7l-7 7" transform="translate(-1 -1)" />
    <path d="m7 17 6-6" />
  </BaseIcon>
);

export const CalendarIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18" />
  </BaseIcon>
);

export const HeartIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9.5 7c-2.5 4.6-9.5 9-9.5 9Z" />
    <path d="M3 12h4l2-3 3 6 2-3h7" />
  </BaseIcon>
);

export const ShieldIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M12 3 4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6z" />
    <path d="m9 12 2 2 4-4" />
  </BaseIcon>
);

export const SettingsIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.2a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.2a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6z" />
  </BaseIcon>
);

export const BellIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </BaseIcon>
);

export const LogoutIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </BaseIcon>
);

export const MenuIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </BaseIcon>
);

export const CloseIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="m18 6-12 12M6 6l12 12" />
  </BaseIcon>
);

export const FolderIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </BaseIcon>
);

export const PulseIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M3 12h4l3-7 4 14 3-7h4" />
  </BaseIcon>
);

export const HelpIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 1 1 5.2 2c-.6.6-1.3 1-1.8 1.5-.3.3-.5.7-.5 1.5" />
    <path d="M12 17h.01" />
  </BaseIcon>
);

export const ClockIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </BaseIcon>
);

export const PlusIcon: IconComponent = (props) => (
  <BaseIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </BaseIcon>
);
