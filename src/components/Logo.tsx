function LogomarkPaths() {
  return (
    <text
      x="0"
      y="20"
      fontSize="20"
      fontFamily="Arial, sans-serif"
      fill="#38BDF8"
    >
      TRUSTCENTER
    </text>
  );
}

export function Logomark(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 36" fill="none" {...props}>
      <LogomarkPaths />
    </svg>
  );
}

// Removed the <a> wrapper — let the parent handle linking
export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 200 36" fill="none" aria-hidden="true" {...props}>
      <LogomarkPaths />
    </svg>
  );
}
