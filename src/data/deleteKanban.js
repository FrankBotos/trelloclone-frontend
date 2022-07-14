export default function DeleteKanban(id) {

    async function runQuery() {

    var objToDelete = {
        "id": id
    }


    var url = process.env.REACT_APP_EXPRESS_URL + "delete";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(objToDelete),
    });
    const data = await res.json();
    return data;

    }

    
    return runQuery();
    


  }