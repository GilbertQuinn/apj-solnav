/* eslint-disable */
import React, { useState } from "react";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";

function SolutionEditSubList(props) {

    const subList = props.subList;
    const subListName = props.subListName;
    return subList && 
    <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>URL</th>
            <th><Button iconName="add-plus" variant="link" onClick={() => {props.handleAddItem(subListName)}} /></th>
        </tr>
        </thead>
        <tbody>
        {subList.map((doc, index) => (
            <tr key={index}>
            <td><Input type="text" name="name" value={doc.name} onChange={(e) => (props.handleListChange(e,subListName,"name",index))}/></td>
            <td><Input type="text" name="description" value={doc.description} onChange={(e) => (props.handleListChange(e,subListName,"description",index))}/></td>
            <td><Input type="text" name="url" value={doc.url} onChange={(e) => (props.handleListChange(e,subListName,"url",index))}/></td>
            <td><Button variant="link" onClick={() => {props.handleListItemDelete(subListName,index)}}>Delete</Button></td>
            </tr>
        ))}
        </tbody>
    </table> 
}

export default SolutionEditSubList;