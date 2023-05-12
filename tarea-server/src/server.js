import { appendFile, existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { createServer } from 'http'
import path from 'path'

const PORT = 3000
const STATIC_FOLDER = 'static'
const LOG_FILE = 'mycoolserver.log'

const httpServer = createServer((req, res) => {
    const { method, url } = req

    switch (method) {
        case 'GET':
            getHandler(method, url, res)
            break;
        default:
            res.writeHead(405)
            res.end('Method Not Allowed')
            console.error(`${method} - ${url} 405 Method Not Allowed`)
            break;
    }
})

const getHandler = async (method, url, res) => {
    let isHome = false
    if(url === '' || url === '/' || url === '/home' || url === '/home.html' || url === '/index') isHome = true

    let filePath = path.join(new URL(import.meta.url).pathname, '..', '..', STATIC_FOLDER, isHome ? '/index.html' : url)
   
    if(!existsSync(filePath)) {
        res.writeHead(404)
        res.end('Not Found')
        console.error(`${method} - ${url} 404 Not Found`)
        return
    }

    try{
        const response = await readFile(filePath)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(response)
        console.log(`${method} - ${url} 200 OK`)
    }catch(err) {
        res.writeHead(500)
        res.end('Internal Server Error')
        console.error(`${method} - ${url} 500 Internal Server Error: ${err.message}`)
    }
}

httpServer.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))

appendFile(LOG_FILE, `Server started at ${new Date()}\n`, (err) => {
    if(err) console.error(`Cannot write to log file: ${err.message}`)
    else console.log(`Log file: ${LOG_FILE}`)
})