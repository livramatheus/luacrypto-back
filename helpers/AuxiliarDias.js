const abreviacoesMeses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

exports.isMercadoAberto = (data = new Date()) => {
    return (
        [1, 2, 3, 4, 5].includes(data.getDay()) &&
        (data.getHours() >= 13 && data.getHours() < 20)
    )
};

exports.formataExtenso = (data = new Date()) => {
    return `${data.getDate()}/${abreviacoesMeses[data.getMonth()]}`;
};