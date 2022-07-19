export default function UpdateKanban(newKanban){
    async function runQuery() {
      var url = process.env.REACT_APP_EXPRESS_URL + "update";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKanban),
      });
      const data = await res.json();
      return data;
      }

      console.log(newKanban)
      
      return runQuery();
}