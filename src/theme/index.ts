export const COLORS = {
  background: "#F3F6F4",
  surface: "#FFFFFF",
  primary: "#153E35",
  primarySoft: "#A7F3D0",
  onPrimary: "#FFFFFF",
  subtitle: "#D1E7DF",
  text: "#17202A",
  textSecondary: "#5B6573",
  muted: "#64748B",
  placeholder: "#94A3B8",
  border: "#E5E7EB",
  accent: "#16804A",
} as const;

export const TYPOGRAPHY = {
  size: {
    caption: 12,
    small: 13,
    body: 14,
    subtitle: 15,
    heading: 18,
    title: 27,
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    heavy: "800",
  },
  lineHeight: {
    body: 21,
    subtitle: 22,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  xxl: 22,
  section: 24,
  heroTop: 56,
  heroBottom: 30,
  card: 18,
} as const;
