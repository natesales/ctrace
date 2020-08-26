import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";
import React from "react";

export default function SidebarElement(props) {
    return (
        <Link href={props.href} target="_blank">
            <ListItem button onClick={props.onClickHandler}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.name}/>
            </ListItem>
        </Link>
    )
}
