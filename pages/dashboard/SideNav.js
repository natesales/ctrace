import React from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import SidebarElement from "./SidebarElement";
import List from "@material-ui/core/List";

export default function SideNav(props) {
    return (
        <List>
            <div>
                <SidebarElement name="Export" icon={<GetAppIcon/>} href="/api/admin/export" onClickHandler={props.exportOnClickHandler}/>
            </div>
        </List>
    );
}