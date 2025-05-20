import React, { useState, useEffect } from 'react';
import axios from 'axios';

class CrudModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      error: '',
      formData: {},
      editingId: null,
    };
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async () => {
    try {
      this.setState({ loading: true, error: '' });
      const token = localStorage.getItem('token');
      const response = await axios.get(this.props.apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setState({ items: response.data, loading: false });
    } catch (err) {
      this.setState({ error: 'Error al cargar datos', loading: false });
    }
  };

  handleChange = (e) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { editingId, formData } = this.state;
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`${this.props.apiUrl}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(this.props.apiUrl, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      this.setState({
        formData: {},
        editingId: null,
      });
      this.fetchItems();
    } catch (err) {
      this.setState({ error: 'Error al guardar datos' });
    }
  };

  handleEdit = (item) => {
    this.setState({
      formData: { ...item },
      editingId: item.id,
      error: '',
    });
  };

  handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${this.props.apiUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.fetchItems();
    } catch (err) {
      this.setState({ error: 'Error al eliminar dato' });
    }
  };

  renderFormFields = () => {
    return this.props.fields.map((field) => (
      <input
        key={field.name}
        type={field.type || 'text'}
        name={field.name}
        placeholder={field.placeholder || field.name}
        value={this.state.formData[field.name] || ''}
        onChange={this.handleChange}
        required={field.required || false}
        style={{ flex: '1 1 150px', padding: '0.5rem', margin: '0.25rem' }}
      />
    ));
  };

  render() {
    const { items, loading, error, editingId } = this.state;
    const { title, fields } = this.props;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
        <h2>{title}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form
          onSubmit={this.handleSubmit}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {this.renderFormFields()}
          <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => this.setState({ editingId: null, formData: {}, error: '' })}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          )}
        </form>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {fields.map((field) => (
                  <th
                    key={field.name}
                    style={{ border: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' }}
                  >
                    {field.label || field.name}
                  </th>
                ))}
                <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {fields.map((field) => (
                    <td
                      key={field.name}
                      style={{ border: '1px solid #ccc', padding: '0.5rem' }}
                    >
                      {item[field.name]}
                    </td>
                  ))}
                  <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                    <button onClick={() => this.handleEdit(item)} style={{ marginRight: '0.5rem' }}>
                      Editar
                    </button>
                    <button onClick={() => this.handleDelete(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default CrudModule;
