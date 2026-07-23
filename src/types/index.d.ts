export type MarqueeConfig = {
  elementWidth: string;
  elementWidthAuto?: boolean;
  elementWidthInSmallDevices: string;
  pauseOnHover: boolean;
  reverse?: "reverse" | "" | undefined;
  duration: string;
};

export type customersSectionType = Section & {
  list: MarqueeListItem[];
  marquee: MarqueeConfig;
};

export type VideoConfig = {
  src: string;
  type?: string;
  provider?: "youtube" | "vimeo" | "html5";
  poster?: string;
  autoplay?: boolean;
  id?: string;
};

export type TocHeading = {
  depth: number;
  slug: string;
  text: string;
  subheadings?: TocHeading[];
};

export type Section = {
  enable?: boolean;
  title?: string;
  excerpt?: string;
  date?: Date | string;
  author?: string;
  subtitle?: string;
  categories?: string[];
  description?: string;
  button?: Button;
  image?: string;
  limit?: false | number;
};

export type SocialLink = {
  enable: boolean;
  label: string;
  url: string;
  lucideIcon: string;
  isForShare?: boolean;
  isForShareProject?: boolean;
};

export type Social = {
  enable: boolean;
  list: SocialLink[];
};

export type FAQItem = {
  active: boolean;
  title: string;
  content: string;
};

export type FAQCategory = {
  label: string;
  list: FAQItem[];
};

export type Category = {
  name: string;
  slug: string;
  count?: number;
};

export type TeamItem = {
  name: string;
  role: string;
  status: string;
  image: string;
  social: Social;
};

export type NoteType = "info" | "warning" | "success" | "deprecated" | "hint";

export type DropdownType = "select" | "search";

export interface DropdownSearchConfig {
  placeholder?: string;
}

export interface DropdownItem {
  label: string;
  selected: true;
  value: string;
}

export interface DropdownConfig {
  type?: DropdownType;
  search?: DropdownSearchConfig;
  items: DropdownItem[];
}

export interface InputField {
  label: string;
  placeholder?: string;
  required: boolean;
  halfWidth: boolean;
  defaultValue: string;
  name?: string;
  selected?: boolean;
  value?: boolean;
  checked?: boolean;
  type?: "text" | "email" | "radio" | "checkbox";
  id?: string;
  parentClass?: string;
  tag?: "textarea";
  rows?: string;
  group?: string;
  groupLabel?: string;
  items?: InputField[];
  dropdown?: DropdownConfig;
  note?: NoteType;
  content?: string;
}

export interface ContactFormConfig {
  action: string;
  emailSubject: string;
  submitButton: SubmitButtonConfig;
  note: string;
  inputs: InputField[];
}

export interface Badge {
  enable: boolean;
  label: string;
  color: "primary" | "success" | "danger" | "warning" | string;
  type: "dot" | "text";
}

export interface Testimonial {
  enable: boolean;
  image: string;
  content: string;
}

export interface Service {
  enable: boolean;
  name: string;
}

export interface NavigationLinkCTA {
  enable: boolean;
  image: string;
  eyebrow?: string;
  title: string;
  description: string;
  items?: string[];
  button?: Button;
}

export interface ChildNavigationLink {
  enable: boolean;
  name: string;
  description: string;
  icon: string;
  weight?: number;
  url?: string;
  rel?: string;
  target?: string;
  hasChildren?: boolean;
  badge?: Badge;
  children?: ChildNavigationLink[];
}

export interface NavigationLink extends ChildNavigationLink {
  enable: boolean;
  weight?: number;
  hasMegaMenu?: boolean;
  cta?: NavigationLinkCTA;
  testimonial?: Testimonial;
  services?: Service;
  menus?: NavigationLink[];
}

export type WidgetName =
  | "Search"
  | "RelatedCaseStudies"
  | "Categories"
  | "RecentPosts"
  | "CtaBlock";
