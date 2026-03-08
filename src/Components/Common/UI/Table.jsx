const Table = ({ columns = [], rows = [] }) => {
  return (
    <div className="overflow-x-auto rounded-4xl border app-border">
      <table className="w-full text-sm">
        <thead className="app-surface">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="text-left px-4 py-3 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t app-border">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
