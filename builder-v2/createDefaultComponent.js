import fs from "fs"
import inquirer from "inquirer"
import path from "path"

console.info("----------INICIA CONFIGURACION MAIN COMPONENT----------");

const archivoDeclaracion = './src/router/index.js';
const [, , type, routeName, camelCaseName, tableTitle, className, fileClassName, fileName, ...pathParts] = process.argv;
const pathFile = pathParts ?? pathParts.join(" "); // Unir los componentes de la ruta del directorio

// evaluamos si type != -a (automatico)
if (type != "a") {
  const opciones = [
    {
      type: 'input',
      name: 'routeName',
      message: 'Ingresa el nombre en routeName:',
    },
    {
      type: 'input',
      name: 'camelCaseName',
      message: 'Ingresa el nombre en camelCaseName:',
    },
    {
      type: 'input',
      name: 'className',
      message: 'Ingresa el nombre de la clase:',
    },
    {
      type: 'input',
      name: 'fileClassName',
      message: 'Ingresa nombre del archivo donde se encuentra la clase:',
    },
    {
      type: 'input',
      name: 'fileName',
      message: 'Ingresa el nombre del archivo:',
    },
    {
      type: 'input',
      name: 'path',
      message: 'Ingresa la ruta para guardar el archivo:',
    },
  ];

  inquirer.prompt(opciones).then(respuestas => {
    buildFile(respuestas)
  });
} else { // entra a caso automatico
  // Verificar si se proporcionaron todos los parámetros necesarios
  if (!routeName || !camelCaseName || !tableTitle || !className || !fileClassName || !fileName || !pathFile) {
    console.error('Se requieren todos los parámetros: routeName, camelCaseName, título de la tabla, nombre de la clase, nombre del archivo de la clase, nombre del archivo resultado, path.');
    process.exit(1);
  }

  // construye objeto 'respuestas'
  const respuestas = {
    routeName,
    camelCaseName,
    tableTitle,
    className,
    fileClassName,
    fileName,
    path: pathFile,
  }

  buildFile(respuestas);
}

function buildFile(respuestas) {
  const fileContent = buildFileContent(respuestas)

  handleGuardarArchivo(respuestas.path, respuestas.fileName, fileContent);

  handleDeclararArchivo(respuestas.path + "/" + respuestas.fileName, respuestas);
}

// se construye el contenido del archivo
function buildFileContent(respuestas) {
  return `
  <template>
    <v-container fluid class="">
      <v-row>
        <v-col cols="12">
          <form-agregar-${respuestas.camelCaseName} v-show="modelo.showFormAgregar" :modelo="modelo" />
        </v-col>
        <v-col>
          <v-divider v-show="modelo.showFormAgregar" />
        </v-col>
        <v-col cols="12">
          <table-generica
            title="${respuestas.tableTitle}"
            :modelo="modelo"
            :slots="{ actions }"
            :show-form-agregar="modelo.showFormAgregar"
            :loading-card="modelo.loadingGuardar || modelo.loadingEliminar"
            :loading-button="modelo.loadingListar"
            :loading-table="modelo.loadingListar"
          >
            <template #actions="{ item }">
              <v-btn icon @click="modelo.editar(item)">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="modelo.eliminar(item)">
                <v-icon small>mdi-trash-can</v-icon>
              </v-btn>
            </template>
          </table-generica>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import ${respuestas.className} from "@/models/${respuestas.fileClassName}";
  
  export default {
    data() {
      return {
        modelo: new ${respuestas.className}(),
      };
    },
  
    computed: {},
  };
  </script>
      
  <style>
  </style>`;
}

// insertar en archivo declaracion
function handleDeclararArchivo(filePath, respuestas) {
  const targetFilePath = archivoDeclaracion;

  // Leer el archivo JavaScript
  fs.readFile(targetFilePath, 'utf8', (err, code) => {
    console.info("Insertando en " + archivoDeclaracion);

    if (err) {
      console.error('Error al leer el archivo:', err);
      return;
    }

    // Buscar el índice donde se debe insertar la nueva línea
    const insertAfterIndex = code.indexOf('// builder insert new line');
    if (insertAfterIndex === -1) {
      console.error('No se encontró el comentario para insertar la nueva línea.');
      return;
    }

    // Insertar la nueva línea después del comentario
    const newLine = `{
    path: '${filePath}',
    name: '${respuestas.routeName}',
    component: () => import('../views${filePath}.vue')
  },\n  `;
    const modifiedCode = code.slice(0, insertAfterIndex) + newLine + code.slice(insertAfterIndex);

    // Escribir el código modificado en el archivo
    fs.writeFile(targetFilePath, modifiedCode, 'utf8', (err) => {
      if (err) {
        console.error('Error al escribir el archivo:', err);
        return;
      }
      console.info('Archivo modificado correctamente.');
    });
  });
}

// prueba a guardar el archivo y verifica primero que exista la carpeta
function handleGuardarArchivo(path, fileName, fileContent) {
  const folderPath = `./src/views${path ?? ""}`;

  fs.access(folderPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si hay un error, la carpeta no existe
      console.info(`La carpeta "${folderPath}" no existe. Creándola...`);
      // Crear la carpeta
      fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error al crear la carpeta:', err);
          process.exit(1);
        }
        console.info(`Carpeta "${folderPath}" creada correctamente.`);
        guardarArchivo(fileName, folderPath, fileContent);
      });
    } else {
      // La carpeta ya existe, podemos guardar el archivo
      guardarArchivo(fileName, folderPath, fileContent);
    }
  });
}

// Función para guardar el archivo
function guardarArchivo(fileName, folderPath, fileContent) {
  const filePath = path.join(folderPath, `${fileName}.vue`);

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Error al crear el archivo:', err);
      process.exit(1);
    }
    console.info(`Archivo "${fileName}" creado correctamente.`);
  });
}