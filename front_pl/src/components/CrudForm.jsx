import React from 'react';

const CrudForm = ({ fields, values, onChange, onSubmit, submitLabel = 'Guardar' }) => {
  return (
    <form onSubmit={onSubmit} className="crud-form">
      {fields.map(field => (
        <input
          key={field.key}
          type={field.type || 'text'}
          placeholder={field.label}
          value={values[field.key] || ''}
          onChange={e => onChange(field.key, e.target.value)}
          required={field.required}
        />
      ))}
      <button type="submit">{submitLabel}</button>
    </form>
  );
};

export default CrudForm;
