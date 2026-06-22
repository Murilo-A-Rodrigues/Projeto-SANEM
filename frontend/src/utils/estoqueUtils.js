// Função para calcular o total de peças em estoque
export function getTotalEstoque(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => total + (item.quantidade || 0), 0);
}

// Função para verificar se estoque está baixo
export function isEstoqueBaixo(items) {
  return getTotalEstoque(items) < 10;
}
