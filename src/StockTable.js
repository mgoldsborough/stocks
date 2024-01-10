import React from "react";

const StockTable = ({ data }) => {
  if (!data || data.length === 0) return <>Waiting on ticker data...</>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="md:table-row">
            <th className="block md:table-cell border px-4 py-2 text-blue-600">
              Symbol
            </th>
            <th className="block md:table-cell border px-4 py-2 text-blue-600">
              Volume
            </th>
            <th className="block md:table-cell border px-4 py-2 text-blue-600">
              Accumulated Volume
            </th>
            <th className="block md:table-cell border px-4 py-2 text-blue-600">
              Opening Price
            </th>
            <th className="block md:table-cell border px-4 py-2 text-blue-600">
              VWAP
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {Object.values(data).map((item, index) => (
            <tr key={item.sym} className="md:table-row">
              <td className="block md:table-cell border px-4 py-2">
                {item.sym}
              </td>
              <td className="block md:table-cell border px-4 py-2">{item.v}</td>
              <td className="block md:table-cell border px-4 py-2">
                {item.av}
              </td>
              <td className="block md:table-cell border px-4 py-2">
                {item.op}
              </td>
              <td className="block md:table-cell border px-4 py-2">
                {item.vw}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
