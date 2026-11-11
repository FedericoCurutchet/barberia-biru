import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// @ts-ignore
export function useFetchSinBody(url, refreshTrigger, token, metodo) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        if (error.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.log("a ver el pajin en teoria paso x aca" + error);
      });
  }, [url, refreshTrigger, token]);

  return data;
}
