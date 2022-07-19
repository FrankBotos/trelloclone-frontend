export default function GetAllKanbans() {
  async function runQuery() {
    let data = await (await fetch(process.env.REACT_APP_EXPRESS_URL)).json();
    return data;
  }

  return runQuery();
}
