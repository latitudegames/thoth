import { PouchDB } from "react-pouchdb";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import ReteProvider from "./Rete";
import PubSubProvider from "./PubSub";
import ThothProvider from "./Thoth";

/**
 * Provided that a list of providers [P1, P2, P3, P4] is passed as props,
 * it renders
 *
 *    <P1>
        <P2>
          <P3>
            <P4>
              {children}
            </P4>
          </P3>
        </P2>
      </P1>
 *
 */

function ComposeProviders({ providers, children }) {
  return providers.reduce((acc, current) => {
    const [Provider, props] = Array.isArray(current)
      ? [current[0], current[1]]
      : [current, {}];

    return <Provider {...props}>{acc}</Provider>;
  }, children);
}

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
