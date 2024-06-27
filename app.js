const express = require('express');
const cors = require('cors')
const mysql = require('mysql');
const mssql = require('mssql');
const port = process.env.PORT ?? 3000;


// db intermedia para autenticacion
const dbConfig = {
  host: `${process.env.DB_HOST}`,
  port: process.env.DB_PORT,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
};

const connection = mysql.createPool(dbConfig);

const app = express();

// Logging middleware
const logMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
};

// Add the logging middleware to all routes
app.use(logMiddleware);
app.use(express.json());
app.use(cors())

// fletes =======================================================================

app.get('/empresasTransportistas', async (req, res) => {
  try {
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query("SELECT ID, Descripcion from m4_transportistas where activa=1");

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/choferes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).send('Invalid id argument');
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query(`SELECT ID, Descripcion from m4_choferes where activa=1 and IDTransportistas=${id} ORDER BY Descripcion`);

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/camiones/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).send('Invalid id argument');
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query(`SELECT ID, Descripcion from m4_camiones where activa=1 and IDTransportistas=${id} ORDER BY Descripcion`);

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/acoplados/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).send('Invalid id argument');
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query(`SELECT ID, Descripcion from M4_Acoplados where activa=1 and IDTransportistas=${id} ORDER BY Descripcion`);

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

// armado de remitos ============================================================

/** 
 * Creates a new remito.
 * 
 * req.body:
 * {
 *  iddeposito: number,
 *  idctacte: number,
 *  nombrectacte: string,
 *  idlugaresderecepcion: number,
 *  lugaresderecepcion: string,
 *  comentario: string,
 *  idempresatransportista: number,
 *  empresatransportista: string,
 *  idchofer: number,
 *  chofer: string,
 *  idcamion: number,
 *  camion: string,
 *  idacoplado: number,
 *  acoplado: string,
 *  kilometros: number
 * }
 * 
 */
app.post('/cabeceraRemito', async (req, res) => {
  const { 
    iddeposito, 
    idctacte, 
    nombrectacte, 
    idlugaresderecepcion, 
    lugaresderecepcion, 
    comentario, 
    idempresatransportista, 
    empresatransportista, 
    idchofer, 
    chofer, 
    idcamion, 
    camion, 
    idacoplado, 
    acoplado, 
    kilometros 
  } = req.body;

  if (!Array.isArray(articulos)) {
    throw new Error('Invalid request body. Expected an array.');
  }
  // Create a connection pool
  const pool = await mssql.connect({
    server: `${process.env.DB_PUESTOLOB_SERVER}`,
    database: `${process.env.DB_PUESTOLOB_DATABASE}`,
    user: `${process.env.DB_PUESTOLOB_USER}`,
    password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
    port: Number(process.env.DB_PUESTOLOB_PORT),
    options: {
      trustedConnection: true,
      encrypt: false,
      trustServerCertificate: true,
    },
  });

  try {
    // Begin a transaction
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();

    const request = new mssql.Request(transaction);
    request.input('IDDepositos', iddeposito, mssql.Int);
    request.input('IDCtaCte', idctacte, mssql.Int);
    request.input('NombreCtaCte', nombrectacte, mssql.NVarChar(100));
    request.input('IDLugaresDeRecepcion', idlugaresderecepcion, mssql.Int);
    request.input('LugaresDeRecepcion', lugaresderecepcion, mssql.NVarChar(100));
    request.input('Comentario', comentario, mssql.NVarChar(500));
    request.input('IDEmpresaTransportista', idempresatransportista, mssql.Int);
    request.input('EmpresaTransportista', empresatransportista, mssql.NVarChar(100));
    request.input('IDChoferes', idchofer, mssql.Int);
    request.input('Chofer', chofer, mssql.NVarChar(20));
    request.input('IDCamiones', idcamion, mssql.Int);
    request.input('Camion', camion, mssql.NVarChar(20));
    request.input('IDAcoplados', idacoplado, mssql.Int);
    request.input('Acoplado', acoplado, mssql.NVarChar(20));
    request.input('Kilometros', kilometros, mssql.Int);


    const query = `INSERT M6_PickingCabezal (IDDepositos, IDCtaCte, NombreCtaCte, IDLugaresDeRecepcion, LugaresDeRecepcion, Comentario, IDEmpresaTransportista, EmpresaTransportista, IDChoferes, Chofer, IDCamiones, Camion, IDAcoplados, Acoplado, Kilometros)
    VALUES (@IDDepositos, @IDCtaCte, @NombreCtaCte, @IDLugaresDeRecepcion, @LugaresDeRecepcion, @Comentario, @IDEmpresaTransportista, @EmpresaTransportista, @IDChoferes, @Chofer, @IDCamiones, @Camion, @IDAcoplados, @Acoplado, @Kilometros); ; SELECT SCOPE_IDENTITY() AS id;`;
    
    await transaction
      .request()
      .execute(query)

    // Commit the transaction
    await transaction.commit();
    await pool.close();

    // Send the result as a response
    res.json({
      status: 'ok',
      id: result.recordset[0].id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/pedidosConRemitosPendientes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).send('Invalid id argument');
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query(`SELECT NombreCtaCte, idPedidos, idArticulo, Articulo, Pedido-Remito Pendiente from [dbo].[V6_SaldoPedidos] where Tipo='Venta' and pedido>remito and IDCtaCte=${id} ORDER BY idPedidos, idArticulo`);

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/lugaresDeRecepcion/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).send('Invalid id argument');
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query(`SELECT ID, Descripcion from M0_CuentasCorrientesLugaresDeRecepcion WHERE Modulo=6 AND Activa=1 AND IDCuentasCorrientes=${id} ORDER BY Descripcion`);

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/cuentasRemitos', async (req, res) => {
  try {
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query("SELECT DISTINCT IDCtaCte, NombreCtaCte from [dbo].[V6_SaldoPedidos] where Tipo='Venta' and pedido>remito ORDER BY NombreCtaCte");

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/depositos', async (req, res) => {
  try {
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query("SELECT ID, Descripcion From M0_Depositos WHERE Modulo=6 and Activa=1 ORDER BY id");

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

// =============================================================================

app.get('/articulos', async (req, res) => {
  try {
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Execute a query
    const result = await pool.request().query("SELECT * FROM M6_Picking WHERE ESTADO = 'N'");

    await pool.close()

    // Send the result as a response
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});
  }
});

app.get('/lotes_articulo/:gtin/:gln/:lote', async (req, res) => {
  const { gtin, gln, lote } = req.params;
  try {
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    const result = await pool.request()
    .input('GTIN', mssql.Char, gtin)
    .input('GLN', mssql.Char, gln)
    .input('Lote', mssql.Char, lote)
    .query(`SELECT Lote=@Lote, CantidadDisponible=SUM(LC.Cantidad * LC.Mayor), 
    Vencimiento=(SELECT FechaVencimiento FROM M6_Lotes WHERE ID=LC.IDLote)
    FROM M6_LotesCuerpo LC
    WHERE LC.Activa = 1 
    AND LC.IDLote=(SELECT MAX(M.ID)
        FROM M6_Lotes M 
        WHERE M.Activa = 1 AND M.GTIN = @GTIN AND M.GLNDestino = @GLN 
        AND @Lote=M.CodigoDeLote AND M.Estado ='Confirmada') 
    GROUP  BY  LC.IDLote;`);

    await pool.close();
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/articulos/cuenta/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) res.status(400).send('Invalid id argument');
    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
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
  // console.log('Request Body:', req.body);

  try {
    const articulos = req.body.articulos; // Access the "articulos" key

    if (!Array.isArray(articulos)) {
      throw new Error('Invalid request body. Expected an array.');
    }

    // Create a connection pool
    const pool = await mssql.connect({
      server: `${process.env.DB_PUESTOLOB_SERVER}`,
      database: `${process.env.DB_PUESTOLOB_DATABASE}`,
      user: `${process.env.DB_PUESTOLOB_USER}`,
      password: `${process.env.DB_PUESTOLOB_PASSWORD}`,
      port: Number(process.env.DB_PUESTOLOB_PORT),
      options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Begin a transaction
    const transaction = new mssql.Transaction(pool);
    await transaction.begin();

    try {
      // Update the articles in the database
      for (const article of articulos) {
        const query = `UPDATE M6_Picking SET CantidadPickeada = ${article.CantidadPickeada}, Estado = '${article.Estado}', Lotes = '${article.Lotes}', HoraPicking = '${article.HoraPicking}', FechaPicking = '${article.FechaPicking}' WHERE ID = ${article.ID}`;
        console.log(query);
        await transaction
          .request()
          .query(query);
      }

      // Commit the transaction
      await transaction.commit();
      await pool.close();

      res.status(200).json({ message: 'Articles updated successfully' });
    } catch (updateError) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      console.error(updateError);
      res.status(500).json({ error: `Error updating articles: ${updateError.message}` });
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: `Internal Server Erro ${connectionError.message}` });
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
