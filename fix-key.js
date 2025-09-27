const fs = require("fs");

// Lee el archivo original con la clave multilínea
const key = fs.readFileSync("key.pem", "utf8").trim();

// Convierte saltos de línea a \n
const fixed = key.replace(/\n/g, "\\n");

console.log(fixed);
