import fs from "fs"
import inquirer from "inquirer"
import path from "path"

console.info("----------INICIA CONFIGURACION FORM COMPONENT----------");
const archivoDeclaracion = './src/components/modules/index.js';
const [, , type, modulo, properties, fileName, ...pathParts] = process.argv;
const pathFile = pathParts ?? pathParts.join(" "); // Unir los componentes de la ruta del directorio

// Convertir las propiedades a un objeto (si es necesario)
let props;

try {
  props = JSON.parse(properties);
} catch (error) {
  console.error('Error al parsear las propiedades:', error.message);
  process.exit(1);
}

// evaluamos si type != -a (automatico)
if (type != "a") {
  const opciones = [
    {
      type: 'input',
      name: 'modulo',
      message: 'Ingresa el modulo al que pertenece (LC):',
    },
    {
      type: 'input',
      name: 'props',
      message: 'Ingresa las propiedades en un solo objeto:',
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
  // Solicitar las opciones
  inquirer.prompt(opciones).then(respuestas => {
    // build inputs

    buildFile(respuestas)

    handleDeclararArchivo(respuestas.path, respuestas);
  });
} else {
  // Verificar si se proporcionaron todos los parámetros necesarios
  if (!modulo || !properties || !fileName || !pathFile) {
    console.error('Se requieren todos los parámetros: modulo, props, nombre archivo y path.');
    process.exit(1);
  }

  // construye objeto 'respuestas'
  const respuestas = {
    modulo,
    properties,
    fileName,
    path: pathFile,
  }

  buildFile(respuestas);

  //handleDeclararArchivo(respuestas.path, respuestas);
}

function buildFile(respuestas) {
  // Crear el contenido del archivo
  const fileContent = buildFileContent();
  const fileContentInicial = buildFileContentInicial(respuestas);

  handleGuardarArchivo(respuestas.path, respuestas.fileName, fileContent, fileContentInicial);
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
    const insertAfterIndex = code.indexOf('// builder insert first line');
    if (insertAfterIndex === -1) {
      console.error('No se encontró el comentario para insertar la primera nueva línea.');
      return;
    }
    // Insertar la nueva línea después del comentario
    const nombreLista = `${respuestas.modulo}Components`
    const newLine = `import { ${nombreLista} } from ".${filePath}";\n`;
    const modifiedCode = code.slice(0, insertAfterIndex) + newLine + code.slice(insertAfterIndex);

    // Escribir el código modificado en el archivo
    fs.writeFile(targetFilePath, modifiedCode, 'utf8', (err) => {
      if (err) {
        console.error('Error al escribir el archivo:', err);
        return;
      }
      console.info('Archivo modificado correctamente.');
      fs.readFile(targetFilePath, 'utf8', (err, code) => {
        console.info("Insertando en " + archivoDeclaracion);

        if (err) {
          console.error('Error al leer el archivo:', err);
          return;
        }

        // Buscar el índice donde se debe insertar la nueva línea
        const insertAfterIndex = code.indexOf('// builder insert second line');
        if (insertAfterIndex === -1) {
          console.error('No se encontró el comentario para insertar la segunda nueva línea.');
          return;
        }

        // Insertar la segunda linea despues del segundo comentario
        const newLine = `${nombreLista},\n`;
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
    });
  });
}

function buildFileContent() {
  let generatedInputs = "";

  let inputs = Object.entries(props).map(([propName, propValue]) => {
    const regex = /^cc.*Id$/;
    if (regex.test(propName)) { // quiere decir que es un select
      let cadena = propName.replace(/^cc(.*)Id$/, '$1');
      let value = propName.replace(/(.*)Id$/, '$1');
      let controller = cadena.toLowerCase() + "sController"

      return { label: cadena, model: propName, controller: controller, type: "select" }
    } else { // el resto se evalua el tipo de prop
      let resultado = propName.replace(/([a-z])([A-Z])/g, '$1 $2');
      resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);

      let type;
      if (typeof propValue === 'number' || !isNaN(parseFloat(propValue))) {
        // Si es un número o se puede convertir a número
        type = 'number';
      } else if (typeof propValue === 'string') {
        // Si es una cadena
        type = 'string';
      }

      return { label: resultado, model: propName, controller: "", type: type === 'number' ? (propValue > 0 ? "check" : type) : type };
    }
  });

  generatedInputs = inputs.map(input => {
    if (input.type === "select") {
      return `    <select-generico
          v-model="modelo._${input.model}"
          controller-name="${input.controller}"
          label="${input.label}:"
          item-text="descripcion"
          cols="12"
          md="4"
          multiple
        />`;
    } else if (input.type === "check") {
      return `    <v-col cols="4">
        <v-checkbox
          v-model="modelo._${input.model}"
          :true-value="1"
          :false-value="0"
          label="${input.label}"
          class="mt-n3"
        />
      </v-col>`;
    } else {
      return `    <v-col>
        <w-text-field
          v-model="modelo._${input.model}"
          label="${input.label}"
          type="${input.type}"
        />
      </v-col>`;
    }
  }).join('\n');

  return `<template>
<v-container fluid>
  <w-card class="px-md-16">
    <v-card-title>Agregar Elemento</v-card-title>

    <v-card-text>
      <v-container>
        <v-form ref="form" lazy-validation>
          <v-row dense align="center" justify="center">
          ${generatedInputs}
          </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-container>
          <v-row dense align="center" justify="end">
            <c-button-cancel
              cols="12"
              md="2"
              text="Cancelar"
              @click="modelo.toggleShowFormAgregar(false)"
            />
            <c-button-confirm
              cols="12"
              md="2"
              text="Guardar"
              icon="mdi-save"
              @click="handleGuardar"
            />
          </v-row>
        </v-container>
      </v-card-actions>
    </w-card>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";

export default {
props: {
  modelo: {
    type: Object,
    required: true,
  },
},
data() {
  return {
    rules: {
      required: (val) => val != "" || "Este campo es requerido",
    },
  };
},
computed: {
  showFormAgregar() {
    return this.modelo.showFormAgregar;
  },
},
methods: {
  ...mapActions({
    showAppMessage: "app/showAppMessage",
  }),

  handleGuardar() {
    const formValido = this.$refs.form.validate();

    if (formValido) {
      this.modelo.guardar();
    } else {
      this.showAppMessage({
        type: "warning",
        text: "Faltan campos requeridos",
      });
    }
  },
},
watch: {
  showFormAgregar() {
    this.$refs.form.resetValidation();
  },
},
};
</script>

<style>
</style>`;
}

// se construye el contenido del archivo
function buildFileContentInicial(respuestas) {
  return `import Vue from "vue";
import ${respuestas.fileName} from './${respuestas.fileName}'

const componentsList = [
    Vue.component("${respuestas.fileName}", ${respuestas.fileName}),
]
  
export const ${respuestas.modulo}Components = {
    componentsList
}`;
}

// prueba a guardar el archivo y verifica primero que exista la carpeta
function handleGuardarArchivo(path, fileName, fileContent, fileContentInicial) {
  const folderPath = `./src/components/modules${path ?? ""}`;

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
        guardarArchivoInicial(folderPath, fileContentInicial);
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

// Función para guardar el archivo
function guardarArchivoInicial(folderPath, fileContent) {
  const filePath = path.join(folderPath, `index.js`);

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Error al crear el archivo:', err);
      process.exit(1);
    }
    console.info(`Archivo inicial creado correctamente.`);
  });
}
