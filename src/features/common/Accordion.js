import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import css from './accordion.module.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "transparent",
    boxShadow: 'none',
    padding: '0',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordionSummary: {
    flexDirection: "row-reverse",
  },
  expandIcon: {
    marginRight: 8,
    padding: 0
  },
  detailsRoot: {
    backgroundColor: "transparent",
  },
  elevation0: {
    boxShadow: 'none'
  }
}));

export const SimpleAccordion = (props) => {
  const classes = useStyles();

  return (
    <div className={css['accordion']}>
      <Accordion square={true} elevation={0} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          className={classes.accordionSummary}
          classes={{
            root: classes.root,
            expandIcon: classes.expandIcon,
          }}
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{props.heading}</Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.detailsRoot }}>
          {/* <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography> */}
          {props.children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
