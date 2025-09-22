// Inicialize o Firebase aqui, se necessário

function consultarPizzaLoversCRUD(filtros = {}) {
  const lista = document.getElementById('listaCRUD');
  lista.innerHTML = '';
  db.ref('pizzaLovers').once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const data = childSnapshot.val();
      // Filtros
      if (
        (filtros.nome && !data.nome.toLowerCase().includes(filtros.nome.toLowerCase())) ||
        (filtros.pizza && !data.pizza.toLowerCase().includes(filtros.pizza.toLowerCase()))
      ) return;

      const div = document.createElement('div');
      div.className = 'registro';
      div.innerHTML = `
        <input type="text" value="${data.nome}" id="nome-${key}">
        <input type="text" value="${data.pizza}" id="pizza-${key}">
        <input type="text" value="${data.nivel}" id="nivel-${key}">
        <button onclick="atualizarRegistro('${key}')">Atualizar</button>
        <button onclick="excluirRegistro('${key}')">Excluir</button>
      `;
      lista.appendChild(div);
    });
  });
}

function atualizarRegistro(key) {
  const nome = document.getElementById(`nome-${key}`).value.trim();
  const pizza = document.getElementById(`pizza-${key}`).value.trim();
  const nivel = document.getElementById(`nivel-${key}`).value.trim();
  if (!nome || !pizza || !nivel) {
    alert("Preencha todos os campos!");
    return;
  }
  db.ref('pizzaLovers/' + key).update({ nome, pizza, nivel })
    .then(() => {
      alert("Atualizado com sucesso!");
      consultarPizzaLoversCRUD();
    });
}

function excluirRegistro(key) {
  if (confirm("Tem certeza que deseja excluir este registro?")) {
    db.ref('pizzaLovers/' + key).remove()
      .then(() => {
        alert("Excluído com sucesso!");
        consultarPizzaLoversCRUD();
      });
  }
}

document.getElementById('filtroForm').onsubmit = function(e) {
  e.preventDefault();
  const nome = document.getElementById('filtroNome').value.trim();
  const pizza = document.getElementById('filtroPizza').value.trim();
  consultarPizzaLoversCRUD({ nome, pizza });
};

window.onload = consultarPizzaLoversCRUD;