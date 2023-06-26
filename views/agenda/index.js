var selectedRow = null;

// Show alerts
function showAlert(message, className) {
  const div = document.createElement('div');
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));

  const container = document.querySelector('#contact-form');
  
  if (container) {
    container.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  setTimeout(() => {
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }, 3000);
}

// Clear All Fields
function clearFields() {
  document.querySelector('#firstName').value = '';
  document.querySelector('#directionContact').value = '';
  document.querySelector('#numContact').value = '';
}

// Edit Data
document.querySelector('#contact-list').addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('edit')) {
    selectedRow = target.parentElement.parentElement;
    document.querySelector('#firstName').value = selectedRow.children[0].textContent;
    document.querySelector('#directionContact').value = selectedRow.children[1].textContent;
    document.querySelector('#numContact').value = selectedRow.children[2].textContent;
  }
});

// Add Data
document.querySelector('#contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get Form Values
  const firstName = document.querySelector('#firstName').value;
  const directionContact = document.querySelector('#directionContact').value;
  const numContact = document.querySelector('#numContact').value;
  let contactId = selectedRow !== null ? selectedRow.getAttribute('data-id') : null;

  // Validate
  if (firstName === '' || directionContact === '' || numContact === '') {
    showAlert('Por favor rellena todos los campos', 'danger');
  } else {
    try {
      if (contactId === null) {
        const { data } = await axios.post('/api/contacts', {
          name: firstName,
          direction: directionContact,
          number: numContact
        });

        const list = document.querySelector('#contact-list');
        if (list) {
          const row = document.createElement('tr');
          row.setAttribute('data-id', data.id);

          row.innerHTML = `
            <td>${firstName}</td>
            <td>${directionContact}</td>
            <td>${numContact}</td>
            <td>
              <a href="#" class="btn btn-warning btn-sm edit">Editar</a>
              <a href="#" class="btn btn-danger btn-sm delete">Borrar</a>
            </td>
          `;

          list.appendChild(row);
        }
        showAlert('Contacto creado', 'success');
      } else {
        await axios.put(`/api/contacts/${contactId}`, {
          name: firstName,
          direction: directionContact,
          number: numContact
        });

        if (selectedRow) {
          selectedRow.children[0].textContent = firstName;
          selectedRow.children[1].textContent = directionContact;
          selectedRow.children[2].textContent = numContact;
        }
        showAlert('Informacion del contacto editada', 'info');
      }

      clearFields();
      selectedRow = null;
    } catch (error) {
      showAlert('Error al guardar el contacto', 'danger');
    }
  }
});

// Delete Data
document.querySelector('#contact-list').addEventListener('click', async (e) => {
  const target = e.target;
  if (target.classList.contains('delete')) {
    const row = target.parentElement.parentElement;
    const contactId = row.getAttribute('data-id');

    try {
      await axios.delete(`/api/contacts/${contactId}`, {
        withCredentials: true,
      });

      if (row) {
        row.remove();
      }
      showAlert('Contacto borrado', 'danger');
    } catch (error) {
      showAlert('Error al borrar el contacto', 'danger');
    }
  }
});

(async () => {
  try {
    const { data } = await axios.get('/api/contacts', {
      withCredentials: true,
    });

    const list = document.querySelector('#contact-list');
    if (list) {
      list.innerHTML = ''; // Limpiar la lista antes de agregar los contactos

      data.forEach(contact => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', contact.id); // Establecer el atributo 'data-id' con el ID del contacto

        row.innerHTML = `
          <td>${contact.name}</td>
          <td>${contact.direction}</td>
          <td>${contact.number}</td>
          <td>
            <a href="#" class="btn btn-warning btn-sm edit">Editar</a>
            <a href="#" class="btn btn-danger btn-sm delete">Borrar</a>
          </td>
        `;

        list.appendChild(row);
      });
    }
  } catch (error) {
    window.location.pathname = '/login';
  }
})();
