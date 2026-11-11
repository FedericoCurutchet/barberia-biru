import { useEffect, useState } from "react";

// @ts-ignore
export function useFetch(url, refreshTrigger, token, metodo, datos) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [url, refreshTrigger, token]);

  return data;
}
