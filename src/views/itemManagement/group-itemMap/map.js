/* eslint-disable array-callback-return */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import ItemDataService from "../../../Services/item.service";
import { useSelector, useDispatch } from "react-redux";


import {
  CCard,
  CCardBody,
  CButton,
  
} from "@coreui/react";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 220,
    height: 280,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);

  React.useEffect(() => {
    setLeft(props.ItemList);

    ItemDataService.getAll().then((res) => {
      if (props.ItemList.length > 0) {
        props.ItemList.map((dataL) => {
          res.data = res.data.filter((dataR) => dataR.id !== dataL.id);
        });
      }
     
      setRight(res.data);
    });
  }, [props.ItemList]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const dispatch = useDispatch()
  const toasterShow = useSelector(state => state.toast.toasterShow)

  const renderToaster=(message,color)=>{
    //refresh();
   
    dispatch({type: 'set', toast: {
      toasterShow:!toasterShow,
        toasterMessage:message,
        toasterColor:color
    }})

  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  /* ----Add Item to the group-----*/ 
  const updateGroup = () => {
    const idList = left.map((d) => d.id);

    ItemDataService.insertItem(props.id, idList)
      .then((res) => {
        renderToaster('sucessfully Maped','green')
        console.log(res);
      })
      .catch((e) => {
        renderToaster('Unsucessful','//#e55353')
        console.log(e);
      });
  };

  const customList = (title, items) => (
    <CCard style={{ border: ".5px solid #d8dbe0" }}>
      <CardHeader
        color="light"
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <CCardBody
        style={{
          height: "330px",
          width: "240px",
          minWidth: "200px",
          overflow: "scroll",
        }}
      >
        <List dense component="div" role="list">
          {items.map((value) => {
            const labelId = `transfer-list-all-item-${value.id}-label`;

            return (
              <ListItem
                key={value.id}
                role="listitem"
                button
                onClick={handleToggle(value)}
                style={{ border: "1px solid rgba(0, 0, 21, 0.125)" }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${value.name}`}
                />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </CCardBody>
    </CCard>
  );

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>{customList("Added", left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <CButton
            block
            color="dark"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </CButton>
          <CButton
            block
            color="dark"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </CButton>
          <CButton className='p-2' block color="success" onClick={() => updateGroup()}>
            Add
          </CButton>
        </Grid>
      </Grid>
      <Grid item>{customList("Available", right)}</Grid>
    </Grid>
  );
}
