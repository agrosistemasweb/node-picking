const { getConnection } = require('../db');
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const mssql = require('mssql');

// db intermedia para autenticacion
const dbConfig = {
    host: `${process.env.DB_HOST}`,
    port: process.env.DB_PORT,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
};

const connection = mysql.createPool(dbConfig);

// fletes =======================================================================

/**
* @swagger
* /empresasTransportistas:
*   get:
*     tags: [Transportes]
*     description: Get empresas de transportistas
*     responses:
*       '200':
*         description: A successful response
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   ID:
*                     type: string
*                   Descripcion:
*                     type: string
*       '500':
*         description: Internal Server Error
*
*   
*/
router.get("/empresasTransportistas", async (req, res) => {
    try {
        // Create a connection pool
        const pool = await getConnection();
        
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

/**
* @swagger
* /choferes/{id}:
*   get:
*     tags: [Transportes]
*     description: Get chofere por ID
*     parameters:
*       - in: path
*         name: id
*         description: ID de chofer
*         required: true
*         schema:
*           type: number
*     responses:
*       '200':
*         description: A successful response
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   ID:
*                     type: string
*                   Descripcion:
*                     type: string
*       '500':
*         description: Internal Server Error
*/
router.get("/choferes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) res.status(400).send('Invalid id argument');
        // Create a connection pool
        const pool = await getConnection();
        
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

/**
* @swagger
* /camiones/{id}:
*   get:
*     tags: [Transportes]
*     description: Get camiones por ID
*     parameters:
*       - in: path
*         name: id
*         description: ID de camion
*         required: true
*         schema:
*           type: number
*     responses:
*       '200':
*         description: A successful response
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   ID:
*                     type: string
*                   Descripcion:
*                     type: string
*       '500':
*         description: Internal Server Error
*/
router.get("/camiones/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) res.status(400).send('Invalid id argument');
        // Create a connection pool
        const pool = await getConnection();
        
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

/**
* @swagger
* /acoplados/{id}:
*   get:
*     tags: [Transportes]
*     description: Get acoplados por ID
*     parameters:
*       - in: path
*         name: id
*         description: ID de acoplado
*         required: true
*         schema:
*           type: string
*     responses:
*       '200':
*         description: A successful response
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   ID:
*                     type: string
*                   Descripcion:
*                     type: string
*       '500':
*         description: Internal Server Error
*/
router.get("/acoplados/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) res.status(400).send('Invalid id argument');
        // Create a connection pool
        const pool = await getConnection();
        
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
* @swagger
* /pedidosRemito:
*   post:
*     tags: [Remitos]
*     description: Creates a new remito.
*     parameters:
*       - in: body
*         name: body
*         description: Remito object
*         required: true
*         schema:
*           type: object
*           properties:
*             Estado:
*               type: string
*             IDCtaCte:
*               type: number
*             NombreCtaCte:
*               type: string
*             IDArticulo:
*               type: number
*             CodigoDeBarras:
*               type: string
*             Gtin:
*               type: string
*             GLN:
*               type: string
*             NombreArticulo:
*               type: string
*             Pedidos:
*               type: number
*             Cantidad:
*               type: number
*             Usuario:
*               type: string
*             FechaAlta:
*               type: string
*             HoraAlta:
*               type: string
*             Lotes:
*               type: string
*             CantidadPickeada:
*               type: number
*             FechaPicking:
*               type: string
*             HoraPicking:
*               type: string
*             IDDepositos:
*               type: number
*             IDCabezal:
*               type: number
*     responses:
*       '200':
*         description: A successful response
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*       '400':
*         description: Invalid id argument
*       '500':
*         description: Internal Server Error
* 
*/
router.post("/pedidosRemito", async (req, res) => {

    const { 
        Estado, 
        IDCtaCte, 
        NombreCtaCte, 
        IDArticulo, 
        CodigoDeBarras, 
        Gtin, 
        GLN, 
        NombreArticulo, 
        Pedidos, 
        Cantidad, 
        Usuario, 
        FechaAlta, 
        HoraAlta, 
        Lotes, 
        CantidadPickeada, 
        FechaPicking, 
        HoraPicking, 
        IDDepositos, 
        IDCabezal
    } = req.body;
    // console.log(Estado)
    // if(!Estado) {
    //     res.status(400).json( {status: 'error', error: "Missing param", name: "Estado", type: "string", required: true } );
    //     return
    // }
    // if(["A", "T", "N"].includes(Estado) === false || Estado.length > 1) {
    //     res.status(400).json( {error: "Malformed argument", message: "Estado"} );
    //     return
    // }
    
    // Create a connection pool
    const pool = await getConnection();

    const transaction = new mssql.Transaction(pool);
    
    try {
        // Begin a transaction
        await transaction.begin();
        
        const query = `INSERT INTO m6_Picking (Estado, IDCtaCte, NombreCtaCte, IDArticulo, CodigoDeBarras, Gtin, GLN, NombreArticulo, Pedidos, Cantidad, Usuario, FechaAlta, HoraAlta, Lotes, CantidadPickeada, FechaPicking, HoraPicking, IDDepositos, IDCabezal)
        VALUES (${Estado}, ${IDCtaCte}, ${NombreCtaCte}, ${IDArticulo}, ${CodigoDeBarras}, ${Gtin}, ${GLN}, ${NombreArticulo}, ${Pedidos}, ${Cantidad}, ${Usuario}, ${FechaAlta}, ${HoraAlta}, ${Lotes}, ${CantidadPickeada}, ${FechaPicking}, ${HoraPicking}, ${IDDepositos}, ${IDCabezal});`;
        
        const result = await transaction
        .request()
        .query(query)
        
        // Commit the transaction
        await transaction.commit();
        await pool.close();
        
        // Send the result as a response
        res.status(200).json({
            status: 'ok',
            id: result.recordset[0].id
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log(error);
        res.status(500).json({error:'Internal Server Error', message: error.originalError.message});
    }
});

/** 
 * @swagger
 * /post/pedidosRemitoBulk:
 *   post:
 *     summary: Crea remito con varios pedidos en simultaneo
 *     tags: [Remitos]
 */
router.post("/pedidosRemitoBulk", async (req, res) => {
    const pedidos = req.body; // Ahora esperamos un arreglo de pedidos en el cuerpo de la solicitud

    // Verificar que pedidos es un arreglo
    if (!Array.isArray(pedidos) || pedidos.length === 0) {
        return res.status(400).json({ error: "Se espera un arreglo de pedidos." });
    }

    // Crear una conexión a la base de datos
    const pool = await getConnection();

    const transaction = new mssql.Transaction(pool);

    try {
        // Iniciar una transacción
        await transaction.begin();

        // Preparar la consulta SQL para insertar pedidos
        const preparedStatement = new mssql.PreparedStatement(transaction);
        preparedStatement.input('Estado', mssql.String);
        preparedStatement.input('IDCtaCte', mssql.Int);
        preparedStatement.input('NombreCtaCte', mssql.String);
        preparedStatement.input('IDArticulo', mssql.Int);
        preparedStatement.input('CodigoDeBarras', mssql.String);
        preparedStatement.input('Gtin', mssql.String);
        preparedStatement.input('GLN', mssql.String);
        preparedStatement.input('NombreArticulo', mssql.String);
        preparedStatement.input('Pedidos', mssql.Int);
        preparedStatement.input('Cantidad', mssql.Int);
        preparedStatement.input('Usuario', mssql.String);
        preparedStatement.input('FechaAlta', mssql.DateTime);
        preparedStatement.input('HoraAlta', mssql.DateTime);
        preparedStatement.input('Lotes', mssql.Int);
        preparedStatement.input('CantidadPickeada', mssql.Int);
        preparedStatement.input('FechaPicking', mssql.DateTime);
        preparedStatement.input('HoraPicking', mssql.DateTime);
        preparedStatement.input('IDDepositos', mssql.Int);
        preparedStatement.input('IDCabezal', mssql.Int);

        const insertQuery = `INSERT INTO m6_Picking (Estado, IDCtaCte, NombreCtaCte, IDArticulo, CodigoDeBarras, Gtin, GLN, NombreArticulo, Pedidos, Cantidad, Usuario, FechaAlta, HoraAlta, Lotes, CantidadPickeada, FechaPicking, HoraPicking, IDDepositos, IDCabezal)
                            VALUES (@Estado, @IDCtaCte, @NombreCtaCte, @IDArticulo, @CodigoDeBarras, @Gtin, @GLN, @NombreArticulo, @Pedidos, @Cantidad, @Usuario, @FechaAlta, @HoraAlta, @Lotes, @CantidadPickeada, @FechaPicking, @HoraPicking, @IDDepositos, @IDCabezal);`;

        // Ejecutar la consulta para cada pedido en el arreglo
        for (const pedido of pedidos) {
            await preparedStatement.prepare(insertQuery);
            await preparedStatement.execute(pedido); // Asegúrate de que el objeto pedido tenga todos los campos necesarios
            await preparedStatement.unprepare();
        }

        // Confirmar la transacción
        await transaction.commit();
        await pool.close();

        res.status(200).json({ message: "Pedidos insertados correctamente." });
    } catch (error) {
        // Si ocurre un error, revertir la transacción
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor", message: error.originalError.message });
    }
});

/**
* @swagger
* /cabeceraRemito:
*   post:
*     summary: Crea un remito
*     tags: [Remitos]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               iddeposito:
*                 type: number
*               idctacte:
*                 type: number
*               nombrectacte:
*                 type: string
*               idlugaresderecepcion:
*                 type: number
*               lugaresderecepcion:
*                 type: string
*               comentario:
*                 type: string
*               idempresatransportista:
*                 type: number
*               empresatransportista:
*                 type: string
*               idchofer:
*                 type: number
*               chofer:
*                 type: string
*               idcamion:
*                 type: number
*               camion:
*                 type: string
*               idacoplado:
*                 type: number
*               acoplado:
*                 type: string
*               kilometros: 
*                 type: number
*     responses:
*       '200':
*         description: Creado con exito
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                 id:
*                   type: number
*       '500':
*         description: Internal Server Error
*/
router.post("/cabeceraRemito", async (req, res) => {
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
    
    // Create a connection pool
    const pool = await getConnection();

    const transaction = new mssql.Transaction(pool);
    
    try {
        // Begin a transaction
        await transaction.begin();
        
        const query = `INSERT INTO M6_PickingCabezal 
        (IDDepositos, IDCtaCte, NombreCtaCte, IDLugaresDeRecepcion, LugaresDeRecepcion, Comentario, IDEmpresaTransportista, EmpresaTransportista, IDChoferes, Chofer, IDCamiones, Camion, IDAcoplados, Acoplado, Kilometros) 
        VALUES 
        (${iddeposito}, ${idctacte}, '${nombrectacte}', ${idlugaresderecepcion}, '${lugaresderecepcion}', '${comentario}', ${idempresatransportista}, '${empresatransportista}', ${idchofer}, '${chofer}', ${idcamion}, '${camion}', ${idacoplado}, '${acoplado}', ${kilometros});
        SELECT SCOPE_IDENTITY() AS id;
        `;
        
        const result = await transaction
        .request()
        .query(query)
        
        // Commit the transaction
        await transaction.commit();
        await pool.close();
        
        // Send the result as a response
        res.status(200).json({
            status: 'ok',
            id: result.recordset[0].id
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log(error);
        res.status(500).json({error:'Internal Server Error', message: error.originalError.message});
    }
});

/**
* @swagger
* /cabeceraRemito:
*   get:
*     summary: Obtiene todos los remitos
*     tags: [Remitos]
*     responses:
*       '200':
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   ID:
*                     type: string
*                   IDDepositos:
*                     type: number
*                   IDCtaCte:
*                     type: number
*                   NombreCtaCte:
*                     type: string
*                   IDLugaresDeRecepcion:
*                     type: number
*                   LugaresDeRecepcion:
*                     type: string
*                   Comentario:
*                     type: string
*                   IDEmpresaTransportista:
*                     type: number
*                   EmpresaTransportista:
*                     type: string
*                   IDChoferes:
*                     type: number
*                   Chofer:
*                     type: string
*                   IDCamiones:
*                     type: number
*                   Camion:
*                     type: string
*                   IDAcoplados:
*                     type: number
*                   Acoplado:
*                     type: string
*                   Kilometros: 
*                     type: number
*       '500':
*         description: Internal Server Error
*/
router.get("/cabeceraRemito", async (req, res) => {
    try {
        // Create a connection pool
        const pool = await getConnection();
        
        // Execute a query
        const result = await pool.request()
        .query("SELECT * FROM M6_PickingCabezal");
        
        await pool.close();
        
        // Check if result is found
        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.originalError ? error.originalError.message : error.message });
    }
});

/**
* @swagger
* /cabeceraRemito/{id}:
*   get:
*     summary: Obtiene un remito por su ID
*     tags: [Remitos]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: number
*         required: true
*         description: ID del remito
*     responses:
*       '200':
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 ID:
*                   type: string
*                 IDDepositos:
*                   type: number
*                 IDCtaCte:
*                   type: number
*                 NombreCtaCte:
*                   type: string
*                 IDLugaresDeRecepcion:
*                   type: number
*                 LugaresDeRecepcion:
*                   type: string
*                 Comentarios:
*                   type: string
*                 IDEmpresaTransportista:
*                   type: number
*                 EmpresaTransportista:
*                   type: string
*                 IDChoferes:
*                   type: number
*                 Chofer:
*                   type: string
*                 IDCamiones:
*                   type: number
*                 Camion:
*                   type: string
*                 IDAcoplados:
*                   type: number
*                 Acoplado:
*                   type: string
*                 Kilometros: 
*                   type: number
*       '500':
*         description: Internal Server Error
*/
router.get("/cabeceraRemito/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).send('Invalid id argument');
        return;
    }
    
    try {
        // Create a connection pool
        const pool = await getConnection();
        
        // Execute a query
        const result = await pool.request()
        .input('ID', mssql.Int, id)
        .query("SELECT * FROM M6_PickingCabezal WHERE ID = @ID");
        
        await pool.close();
        
        // Check if result is found
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.originalError ? error.originalError.message : error.message });
    }
});

/**
* @swagger
* /pedidosConRemitosPendientes/{id}:
*   get:
*     summary: Obtiene un remito por su ID
*     tags: [Remitos]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: number
*         required: true
*         description: ID del remito
*     responses:
*       '200':
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 ID:
*                   type: string
*                 IDArticulo:
*                   type: number
*                 Articulo:
*                   type: string
*                 Cantidad:
*                   type: number
*       '500':
*         description: Internal Server Error
*/
router.get("/pedidosConRemitosPendientes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) res.status(400).send('Invalid id argument');
        // Create a connection pool
        const pool = await getConnection();
        
        // Execute a query
        const result = await pool.request().query(`SELECT * from [dbo].[V6_SaldoPedidos] where Tipo='Venta' and pedido>remito and IDCtaCte=${id} ORDER BY idPedidos, idArticulo`);
        
        await pool.close()
        
        // Send the result as a response
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'});
    }
});

router.get("/lugaresDeRecepcion/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) res.status(400).send('Invalid id argument');
        // Create a connection pool
        const pool = await getConnection();
        
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

router.get("/cuentasRemitos", async (req, res) => {
    try {
        // Create a connection pool
        const pool = await getConnection();
        
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

router.get("/depositos", async (req, res) => {
    try {
        // Create a connection pool
        const pool = await getConnection();
        
        // Execute a query
        const result = await pool.request().query("Select ID, Descripcion, GLN From M0_Depositos WHERE Modulo=6 and Activa=1 ORDER BY id");
        
        await pool.close()
        
        // Send the result as a response
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'});
    }
});

// =============================================================================

router.get("/articulos", async (req, res) => {
    try {
        // Create a connection pool
        const pool = await getConnection();
        
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

router.get("/lotes_articulo/:gtin/:gln/:lote", async (req, res) => {
    const { gtin, gln, lote } = req.params;
    try {
        const pool = await getConnection();
        
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

router.get("/articulos/cuenta/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) res.status(400).send('Invalid id argument');
        // Create a connection pool
        const pool = await getConnection();
        
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

router.post("/articulos_pickeados", async (req, res) => {
    // console.log('Request Body:', req.body);
    
    try {
        const articulos = req.body.articulos; // Access the "articulos" key
        
        if (!Array.isArray(articulos)) {
            throw new Error('Invalid request body. Expected an array.');
        }
        
        // Create a connection pool
        const pool = await getConnection();
        
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

router.get("/listado_acopios",async (req, res) => {
    
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

module.exports = router;