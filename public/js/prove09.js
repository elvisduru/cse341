let prev, next;

const pokeList = document.getElementById("pokeList");

const getData = async (url = "") => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const renderList = async (url) => {
  const data = await getData(url);
  console.log(data);
  pokeList.innerHTML = "";
  for (let i in data.results) {
    pokeList.innerHTML += `<li>${data.results[i].name}</li>`;
  }
  next = data.next;
  prev = data.previous;
};

const renderNext = () => {
  if (!next) return;
  renderList(next);
};

const renderPrev = () => {
  if (!prev) return;
  renderList(prev);
};

//Initialize
renderList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=10");

document.getElementById("nextBtn").addEventListener("click", renderNext);
document.getElementById("prevBtn").addEventListener("click", renderPrev);
