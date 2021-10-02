const abreviacoesMeses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

exports.isMercadoAberto = (data = new Date()) => {
    return ![0, 6].includes(data.getDay());
};

exports.formataExtenso = (data = new Date()) => {
    return `${data.getDate()}/${abreviacoesMeses[data.getMonth()]}`;
};