interface TabPanelProps {
  children?: React.ReactNode;
  tag: string;
  value: string;
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, tag, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tag !== value}
      id={`simple-tabpanel-${tag}`}
      aria-labelledby={`simple-tab-${tag}`}
      style={{ width: "100%", height: "100%" }}
      {...other}
    >
      {children}
    </div>
  );
}
