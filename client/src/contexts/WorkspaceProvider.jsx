import EditorProvider from "./EditorProvider";
import ReteProvider from "./ReteProvider";
import LayoutProvider from "./LayoutProvider";

const providers = [ReteProvider, EditorProvider, LayoutProvider];

function ComposeProviders({ providers, children, ...parentProps }) {
  const _providers = [...providers].reverse();
  return _providers.reduce((acc, current) => {
    const [Provider, props] = Array.isArray(current)
      ? [current[0], current[1]]
      : [current, {}];

    const componentProps = {
      ...props,
      ...parentProps,
    };

    return <Provider {...componentProps}>{acc}</Provider>;
  }, children);
}

// Centralize all our providers to avoid nesting hell.
const WorkspaceProviders = ({ children, ...props }) => (
  <ComposeProviders providers={providers} {...props}>
    {children}
  </ComposeProviders>
);

export default WorkspaceProviders;
