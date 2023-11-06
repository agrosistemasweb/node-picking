const express = require('express');
const cors = require('cors')
const mysql = require('mysql');
const mssql = require('mssql');

const port = process.env.PORT ?? 3000;


// Config BD MySQL
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
      const result = await pool.request().query(`SELECT * FROM M6_Picking where IDCtaCte = ${id}`);

      await pool.close()

      // Send the result as a response
      res.json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).json({error:'Internal Server Error'});
    }
  });


  app.get('/getComisionista/:id/:idC', async (req, res) => {

    const { id, idC } = req.params;

    const qry = `SELECT cdb.*, mucdb.farmer_id
        from mob_user_by_client_database_connection as mucdb
        inner join client_database_connection as cdb on cdb.CLIENT_DATABASE_CONNECTION_ID = mucdb.CLIENT_DATABASE_CONNECTION_ID
        where mucdb.USER_ID  = ${id} 
        and mucdb.FARMER_ID  = ${idC}`;

    connection.query(qry, async (err, result) => {
      if (err) {
        console.error('Error en la consulta: ' + err.message);
        res.status(500).json({error: 'Error interno del servidor'});
        return;
      }

      if (result.length === 0) {
        res.status(404).send('No se encontraron resultados para el ID proporcionado.');
      } else {
        // Iterar a través de los resultados de MySQL
        for (const cnx_remota of result) {
          const servidor_externo = cnx_remota.URL;
          const usuario_externo = cnx_remota.USER;
          const password_externo = cnx_remota.PASSWORD;
          const ddbb_externo = cnx_remota.DATABASE_NAME;

          const Sqlconfig = {
            user: usuario_externo,
            password: password_externo,
            server: servidor_externo,
            database: ddbb_externo,
            options: {
              trustedConnection: true,
              encrypt: false,
              trustServerCertificate: true,
            },
          };

          try {
            const pool = await mssql.connect(Sqlconfig);
            const request = pool.request();
            request.input('IDComisionistas', mssql.Int, idC);

            // Ejecutar la consulta SQL Server
            const recordset = await request.execute('M0_CuentasCorrientesListaPorComisionista');
            await pool.close()
            
            res.json(recordset.recordset);
          } catch (error) {
            console.error(`Error al conectar o ejecutar la consulta en ${servidor_externo}: ${error.message}`);
            res.status(500).json({error:'Error interno del servidor'});
          }
        }
      }
    });

    
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

  app.post('/alta_remito', async (req, res) => {
    try {
        const sqlConfig = {
            server: '179.43.116.142',
            database: 'PuestoLob_Pick',
            user: 'qq',
            password: 'qq11',
            options: {
                trustedConnection: true,
                encrypt: false,
                trustServerCertificate: true,
            },
        };

        const pool = await mssql.connect(sqlConfig);

        const {
            ID,
            IDTiposDeMovimientos,
            IDFletes,
            IDCuentasCorrientes,
            IDSubCuentasCorrientes,
            IDCtasCtesLugaresDeRecepcion,
            IDCampanias,
            IDComprobantes,
            IDFormularios,
            IDUnidadesDeNegocio,
            IDMonedas,
            IDExpresadoEn,
            Cotizacion,
            NroInterno,
            Sucursal,
            Numero,
            Fecha,
            FechaDeAlta,
            TipoVenta,
            Propio,
            LugarDeRecepcion,
            Comentario,
            Status,
            IDProveedor3eros,
            IDCuentaDestino3eros,
            IDLugaresDeRecepcion3eros,
            Usuario,
            Accion,
        } = req.body;

        const request = pool.request();

        request.input('ID', sql.Int, ID);
        request.input('IDTiposDeMovimientos', sql.Int, IDTiposDeMovimientos);
        request.input('IDFletes', sql.Int, IDFletes);
        request.input('IDCuentasCorrientes', sql.Int, IDCuentasCorrientes);
        request.input('IDSubCuentasCorrientes', sql.Int, IDSubCuentasCorrientes);
        request.input('IDCtasCtesLugaresDeRecepcion', sql.Int, IDCtasCtesLugaresDeRecepcion);
        request.input('IDCampanias', sql.Int, IDCampanias);
        request.input('IDComprobantes', sql.Int, IDComprobantes);
        request.input('IDFormularios', sql.Int, IDFormularios);
        request.input('IDUnidadesDeNegocio', sql.Int, IDUnidadesDeNegocio);
        request.input('IDMonedas', sql.Int, IDMonedas);
        request.input('IDExpresadoEn', sql.Int, IDExpresadoEn);
        request.input('Cotizacion', sql.SmallMoney, Cotizacion);
        request.input('NroInterno', sql.VarChar(20), NroInterno);
        request.input('Sucursal', sql.VarChar(4), Sucursal);
        request.input('Numero', sql.VarChar(8), Numero);
        request.input('Fecha', sql.SmallDateTime, Fecha);
        request.input('FechaDeAlta', sql.SmallDateTime, FechaDeAlta);
        request.input('TipoVenta', sql.Bit, TipoVenta);
        request.input('Propio', sql.Bit, Propio);
        request.input('LugarDeRecepcion', sql.VarChar(255), LugarDeRecepcion);
        request.input('Comentario', sql.VarChar(3000), Comentario);
        request.input('Status', sql.VarChar(20), Status);
        request.input('IDProveedor3eros', sql.Int, IDProveedor3eros);
        request.input('IDCuentaDestino3eros', sql.Int, IDCuentaDestino3eros);
        request.input('IDLugaresDeRecepcion3eros', sql.Int, IDLugaresDeRecepcion3eros);
        request.input('Usuario', sql.Int, Usuario);
        request.input('Accion', sql.TinyInt, Accion);
        request.output('Retval', sql.Int);           

        const result = await request.execute('M6_RemitosABM');
        const retval = result.output['Retval'];

        res.json({ Retval: retval });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});


  app.listen(port, () => {
    console.log(`Servidor Express en ejecución en el puerto ${port}`);
  });
// });
