import { useState, useEffect } from "react";

export function SelectorMes({ onMes }) {
  const [mes, setMes] = useState(new Date().getMonth());
  const [dias, setDias] = useState(0);

  useEffect(() => {
    const fechaFinal = new Date();
    console.log(fechaFinal);
    fechaFinal.setMonth(mes + 1);
    fechaFinal.setDate(0);
    const totalDias = fechaFinal.getDate();
    console.log(fechaFinal);

    setDias(totalDias);

    if (onMes) {
      onMes(mes);
    }
  }, [mes, onMes]);

  return (
    <div className="flex flex-col gap-4">
      <select
        name="mes"
        id="mes"
        value={mes}
        onChange={(e) => {
          const valorNumerico = Number(e.target.value);
          setMes(valorNumerico);
        }}
        className="rounded-lg border border-gray-300 p-2 bg-white"
      >
        <option value="0">Enero</option>
        <option value="1">Febrero</option>
        <option value="2">Marzo</option>
        <option value="3">Abril</option>
        <option value="4">Mayo</option>
        <option value="5">Junio</option>
        <option value="6">Julio</option>
        <option value="7">Agosto</option>
        <option value="8">Septiembre</option>
        <option value="9">Octubre</option>
        <option value="10">Noviembre</option>
        <option value="11">Diciembre</option>
      </select>
      {/* 
      <div className="flex flex-wrap gap-2">
        <select name="dias" id="dias" multiple={true} defaultValue={1}>
          {" "}
          {Array.from({ length: dias }, (_, index) => index + 1).map((dia) => (
            <option value={dia} key={dia}>
              {" "}
              {dia}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  );
}
