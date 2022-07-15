export default function CreateKanban(title, uid, creationDate) {

    async function runQuery() {

      var initColumns = {
        ["1"]: {
          name: "To do",
          items: [],
        },
        ["2"]: {
          name: "In Progress",
          items: [],
        },
      
        ["3"]: {
          name: "Done",
          items: [],
        },
      };

      var tempKanban = {
        "uid": uid,
        "title": title,
        "archived": false,
        "columns": initColumns, 
        "items": null,
        "created": creationDate
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
  