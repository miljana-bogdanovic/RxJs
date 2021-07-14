
const API_URL = "http://localhost:3000";
export const getPlayer = async (input: String) => {
  let player;
  await fetch(`${API_URL}/players/?name=${input}`)
    .then((response) => {
      if (response.ok) player = response.json();
      else throw new Error("fetch error");
    })
    .catch((er) => console.log(er));
  return player;
};
export const postPlayer = async (
  input: String
): Promise<{ name: string; highScore: number; id: string }[]> => {
  let player;
  fetch(`${API_URL}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input,
      highScore: 0,
    }),
  })
    .then((p) => {
      if (p.ok) {
        player = p.json();
      } else throw new Error("fetch error");
    })
    .catch((er) => console.log(er));
  return [];
};
export const putPlayerHighScore = async (
  input: number,
  id: string,
  name: string
): Promise<void> => {
  console.log("upis u bazy");
  console.log(input, id, name);
  fetch(`${API_URL}/players/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: name,
      highScore: input,
    }),
  })
    .then((p) => {
      if (p.ok) {
        return p.json();
      } else throw new Error("fetch error");
    })
    .catch((er) => console.log(er));
  return;
};
