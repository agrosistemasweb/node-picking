const express = require('express');
const cors = require('cors')
const mysql = require('mysql');
const mssql = require('mssql');
const port = process.env.PORT ?? 3000;


// Config BD MySQL todo: pasar a ENV
const dbConfig = {
  host: '167.71.171.117',
  port: 3306,
  user: 'nestor',
  password: 'advanta',
  database: 'as.comercializacion.web',
};

const connection = mysql.createPool(dbConfig);

const app = express();

app.use(express.json());
app.use(cors())


app.post('/articulos', async (req, res) => {
  const { user_email, password } = req.body;
  
  try {
    connection.query(
      'SELECT * FROM mob_user WHERE PASSWORD = md5(?) AND EMAIL = ? AND ENABLED = 1',
      [password, user_email],
      async (err, results) => {
        if (err) {
          console.error('Error en la consulta: ' + err.message);
          res.status(500).json({ error:'Error interno del servidor' });
          return;
        }

        if (results.length > 0) {
          const usuario = results.map((row) => ({
            USER_ID: row.USER_ID,
            EMAIL: row.EMAIL,
            NOMBRE: row.NOMBRE,
            APELLIDO: row.APELLIDO,
          }));
          res.json({ usuario });
        } else {
          res.status(404).json({ usuario: 0 });
        }
      }
    );
    
  } catch (error) {
    console.error('Error en el query a la base de datos: ' + err.message);
    res.status(500).json({error: "Error en el query a la base de datos"});
  }
});

app.post('/users_login', async (req, res) => {
  const { user_email, password } = req.body;
  
  try {
    connection.query(
      'SELECT * FROM mob_user WHERE PASSWORD = md5(?) AND EMAIL = ? AND ENABLED = 1',
      [password, user_email],
      async (err, results) => {
        if (err) {
          console.error('Error en la consulta: ' + err.message);
          res.status(500).json({ error:'Error interno del servidor' });
          return;
        }

        if (results.length > 0) {
          const usuario = results.map((row) => ({
            USER_ID: row.USER_ID,
            EMAIL: row.EMAIL,
            NOMBRE: row.NOMBRE,
            APELLIDO: row.APELLIDO,
          }));
          res.json({ usuario });
        } else {
          res.status(404).json({ usuario: 0 });
        }
      }
    );
    
  } catch (error) {
    console.error('Error en el query a la base de datos: ' + err.message);
    res.status(500).json({error: "Error en el query a la base de datos"});
  }
});

app.get('/articulos', async (req, res) => {
  try {
    // Create a connection pool
    const pool = await mssql.connect({
      server: '179.43.116.142',
      database: 'PuestoLob_Pick',
      user: 'qq',
      password: 'qq11',
      port: 1433,
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query('SELECT * FROM M6_Picking');

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/articulos/cuenta/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).send('Invalid id argument');
    // Create a connection pool
    const pool = await mssql.connect({
      server: '167.71.171.117',
      database: 'PuestoLob_Pick',
      user: 'qq',
      password: 'qq11',
      port: 1433,
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query(`SELECT * FROM M6_Picking where IDCtaCte = ${id}`);

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});


app.post('/articulos_pickeados', async (req, res) => {
  try {
    const articulos = req.body;

    // Create a connection pool
    const pool = await mssql.connect({
      server: '167.71.171.117',
      database: 'PuestoLob_Pick',
      user: 'qq',
      password: 'qq11',
      port: 1433,
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Update the articles in the database
    for (const article of articulos) {
      await pool
        .request()
        .query(`UPDATE M6_Picking SET CantidadPickeada = ${article.CantidadPickeada} WHERE ID = ${article.ID}`);
    }

    await pool.close();

    res.status(200).json({ message: 'Articles updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/listado_acopios',async (req, res) => {

  const query = `
          SELECT storage.name, storage.subdomain_name, storage.logo_path, storage.storage_id, client_database_connection.CLIENT_DATABASE_CONNECTION_ID
          FROM STORAGE
          JOIN client_database_connection
          WHERE storage.storage_id = client_database_connection.STORAGE_ID
          AND client_database_connection.MOBILE_ENABLED = 1
          ORDER BY storage.name ASC
      `;

  connection.query(query, async (err, results) => {
    if (err) {
      console.error('Error en la consulta: ' + err.message);
      res.status(500).json({error: 'Error interno del servidor'});
      return;
    }

    if (results.length > 0) {
      const resultados = results;
      res.json({ resultados });
    } else {
      res.status(404).json({ resultados: 0 });
    }
  });

  
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});
