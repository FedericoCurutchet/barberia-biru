import { useEffect, useState } from "react";

export function useFetchPost(url, parametros) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url, parametros);
  }, []);
}
