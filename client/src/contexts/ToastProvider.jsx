import { makeStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";

const useStyles = makeStyles(() => ({
  success: {
    border: "1px solid var(--green)",
    background: "var(--dark-2)",
  },
  error: {
    border: "1px solid var(--red)",
    background: "var(--dark-2)",
  },
  warning: {
    border: "1px solid var(--yellow)",
    background: "var(--dark-2)",
  },
  info: {
    border: "1px solid var(--blue)",
    background: "var(--dark-2)",
  },
}));

const ToastProvider = ({ children }) => {
  const classes = useStyles();

  return (
    <SnackbarProvider
      maxSnack="3"
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default ToastProvider;
