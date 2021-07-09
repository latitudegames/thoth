import { PouchDB } from "react-pouchdb";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import ReteProvider from "./Rete";
import PubSubProvider from "./PubSub";
import ThothProvider from "./Thoth";
import ComposeProviders from "./ComposeProvider";

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

// Centralize all our providers to avoid nesting hell.
const AppProviders = ({ children }) => {
  const providers = [
    ThothProvider,
    [ThemeProvider, { theme: darkTheme }],
    [PouchDB, { name: "thoth" }],
    PubSubProvider,
    ReteProvider,
  ];

  return <ComposeProviders providers={providers}>{children}</ComposeProviders>;
};

export default AppProviders;
