export default function CreateKanban() {

    async function runQuery() {

      var tempKanban = {
        "uid": 1231414124,
        "title": "My Kanban Board",
        "archived": false,
        "columns": {
          "123123": {
            "name": "To Do",
            "items": [
              {"id":1234, "content":"task1", "due": null},
              {"id":4312, "content":"task2", "due": null}
              ]
          },
          "213124": {
            "name": "Doing",
            "items": [
              {"id":1234, "content":"task2", "due": null},
              {"id":4312, "content":"task3", "due": null}
              ]
          }
        }
    }



    var url = process.env.REACT_APP_EXPRESS_URL + "create";
    console.log(url);
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
  