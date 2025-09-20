import React from 'react';

const CrudTable = ({ columns, data, onDelete, onEdit }) => {
  return (
    <table className="crud-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
          {(onEdit || onDelete) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={row._id || idx}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
            {(onEdit || onDelete) && (
              <td>
                {onEdit && <button onClick={() => onEdit(row)}>Editar</button>}
                {onDelete && <button onClick={() => onDelete(row._id)}>Eliminar</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CrudTable;
