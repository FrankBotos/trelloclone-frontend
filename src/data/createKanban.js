import { useState, useContext } from "react";
import { UserContext } from "../context/usercontext";

export default function CreateKanban(title, uid) {

    async function runQuery() {

      var tempKanban = {
        "uid": uid,
        "title": title,
        "archived": false,
        "columns": null,
        "items": null
    }

    var url = process.env.REACT_APP_EXPRESS_URL + "create";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tempKanban),
    });
    const data = await res.json();
    return data;

    }

    return runQuery();


  }
  