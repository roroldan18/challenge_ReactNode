import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Esto reemplaza la BD.
let userData: Array <Record <string, string>> = []

app.use(cors());

app.post('/api/files', upload.single('file'),async (req, res) => {
    // 1. Extract Files From request
    const { file } = req;

    // 2. Validate that we have files
    if (!file) {
        return res.status(500).json({
            message: 'File is required'
        });
    }

    // 3. Validate the mimetype (csv)
    if (file.mimetype !== 'text/csv') {
        return res.status(500).json({
            message: 'Invalid file type'
        });
    }

    let json: Array <Record <string, string>> = []
    try {
        // 4. Transform File (Buffer) to String
        const csv = Buffer.from(file.buffer).toString('utf-8');
        
        // 5. Parse CSV
        json = csvToJson.fieldDelimiter(',').csvStringToJson(csv)

    } catch (error) {
        return res.status(500).json({
            message: 'Error parsing the file'
        });
    }

    // 6. Save the JSON to DB (or memory)
    userData = json;

    return res.status(200).json({
        data: userData, 
        message: 'El archivo se cargó correctamente' 
    });

}) 

app.get('/api/users', async (req, res) => {
    // 1. Extract the query  param 'q' from the request
    const { q } = req.query;
    // 2. Validate that we have a query param
    if(!q){
        return res.status(500).json({
            message: 'Query param "q" is required'
        })
    }
     
    if (Array.isArray(q)){
        return res.status(500).json({message: 'Query param "q" must be string'})
    }

    // 3. Filter the data from the DB (or memory) with the query param
    const search = q.toString().toLowerCase();

    const filterData = userData.filter((row => {
        return Object
        .values(row)
        .some(value => value
            .toLowerCase()
            .includes(search))
    }));

    // 4. Send Response 200 with the filtered data
    return res.status(200).json({ data: filterData });
});

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});