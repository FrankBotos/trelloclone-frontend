export default function UpdateKanbanTitle(id, newTitle){
    async function runQuery() {
      var url = process.env.REACT_APP_EXPRESS_URL + "updatetitle";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id,
            title: newTitle
        }),
      });
      const data = await res.json();
      return data;
      }

      return runQuery();
}