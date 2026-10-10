import { useEffect, useState } from "react";

// @ts-ignore
export function useFetch(url, refreshTrigger) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => console.log(error));
  }, [url, refreshTrigger]);

  return data;
}
