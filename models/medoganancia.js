const db = require("../config/db");

const getDadosMedoGanancia = () => {
    let selectMedoGanancia = `SELECT *
                                FROM historico_medo_ganancia
                               ORDER BY data ASC`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectMedoGanancia,
            timeout: 10000
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar os dados de medo e ganancia ' + error.message);
            }

            resolve(results);
        })
    })
}

const insereMedoGananciaBanco = (toInsert) => {

    let insertInto = `INSERT INTO historico_medo_ganancia(data, indice, descricao)
                                                   VALUES ?;`;

    db.query({
        sql: insertInto,
        timeout: 10000,
        values: [toInsert]
    }, function (error, result, fields) {
        if (error) {
            console.log('❌ Erro ao inserir registro de medo e ganância ', new Date().toLocaleString(), error.message);
        }

        return true;
    });

}

module.exports = {
    insereMedoGananciaBanco,
    getDadosMedoGanancia
}