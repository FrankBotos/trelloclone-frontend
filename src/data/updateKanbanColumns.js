export default function UpdateKanbanColumns(id, newCols) {
  async function runQuery() {
    var url = process.env.REACT_APP_EXPRESS_URL + "updatecols";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        columns: newCols,
      }),
    });
    const data = await res.json();
    return data;
  }

  return runQuery();
}
