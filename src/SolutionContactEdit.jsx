/* eslint-disable */
import React, { useState } from "react";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";

function SolutionContactEdit(props) {

    const subList = props.subList;
    const subListName = props.subListName;
    return subList && 
    <table>
        <thead>
        <tr>
            <th>Area</th>
            <th>Alias</th>
            <th>Fullname</th>
            <th>Role</th>
            <th><Button iconName="add-plus" variant="link" onClick={() => {props.handleAddItem(subListName)}} /></th>
        </tr>
        </thead>
        <tbody>
        {subList.map((contact, index) => (
            <tr key={index}>
            <td><Input type="text" name="area" value={contact.area} onChange={(e) => (props.handleListChange(e,subListName,"area",index))}/></td>
            <td><Input type="text" name="alias" value={contact.alias} onChange={(e) => (props.handleListChange(e,subListName,"alias",index))}/></td>
            <td><Input type="text" name="fullname" value={contact.fullname} onChange={(e) => (props.handleListChange(e,subListName,"fullname",index))}/></td>
            <td><Input type="text" name="role" value={contact.role} onChange={(e) => (props.handleListChange(e,subListName,"role",index))}/></td>
            <td><Button variant="link" iconName="remove" onClick={() => {props.handleListItemDelete(subListName,index)}}></Button></td>
            </tr>
        ))}
        </tbody>
    </table> 
}

export default SolutionContactEdit;