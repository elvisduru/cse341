const renderList = () => {
  const nameList = document.getElementById("nameList");
  fetch("/prove/prove10/fetchAll")
    .then((response) => response.json())
    .then((data) => {
      while (nameList.firstChild) {
        nameList.firstChild.remove();
      }

      for (const avenger of data.avengers) {
        const li = document.createElement("li");
        li.textContent = avenger.name;
        nameList.appendChild(li);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const submitName = () => {
  const newName = document.getElementById("newName").value;
  const csrfToken = document.getElementById("csrf").value;
  fetch("/prove/prove10/insert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newName, _csrf: csrfToken }),
  })
    .then((res) => {
      // Clear the input
      document.getElementById("newName").value = "";

      // Repopulate the list with our new name added
      renderList();
    })
    .catch((err) => {
      // Clear the input
      document.getElementById("newName").value = "";
      console.error(err);
    });
};

// Initialization
renderList();
