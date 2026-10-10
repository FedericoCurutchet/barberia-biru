import { useEffect, useState } from "react";

// @ts-ignore
export function useFetchCorte(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url).then((res) =>
      res
        .json()
        .then((data) => {
          // @ts-ignore
          let dataNueva = [];
          // @ts-ignore
          data.forEach((element) => {
            let nuevo = {
              id: element.id,
              cliente: element.cliente,
              monto: element.monto,
              montoBarberia: element.montoBarberia,
              comisionBarbero: element.comisionBarbero,
              metodoPago: element.metodoPago,
              hora: new Date(element.hora),
              nombre: element.barbero.nombre,
            };
            dataNueva.push(nuevo);
          });
          // @ts-ignore
          console.log(dataNueva);
          // @ts-ignore
          setData(dataNueva);
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false)),
    );
  }, [url]);

  return { data, loading, error };
}
