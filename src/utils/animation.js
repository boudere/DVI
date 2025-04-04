import { DATA_INFO } from "/src/data/scene_data.js";

class Animation {
    constructor(scene) {
        this.animation = {};

        this.DURATION = "duration";

        // carga los jsons
        this.data_json = scene.scene.get(DATA_INFO).get_data_json().Json;
        this.animation_data = scene.scene.get(DATA_INFO).get_json(this.data_json.Animation);
    }

    // setea las animaciones
    get_animation_data(animation, data) {

        let data_assistant = {};
        // sirve para saber los valores default para las siguientes animaciones
        Object.entries(data).forEach(([key, value]) => {
            data_assistant[key] = value;
        });

        // se mueve por todas las estancias de la animacion
        Object.entries(animation).forEach(([key, value]) => {
            this.animation[key] = [];

            // carga los valores default de la animacion
            Object.entries(data_assistant).forEach(([data_assistant_key, __data_assistant_value]) => {
                data[data_assistant_key] = data_assistant[data_assistant_key];
            });

            // se mueve por cada una de las animaciones que se ejecutan a la vez
            value.forEach((__val) => {
                // añade dichos valores a la animacion
                this.animation[key].push({});

                // setea los valores de la animacion
                let index = this.animation[key].length - 1;
                this.get_animation(data_assistant, animation, key, index, data);
            });
        });
        // devuelve los datos de la animacion
        return this.animation;
    }

    // setea los valores de la animacion
    get_animation(data_assistant, animation, key, index, data) {
        // obtiene lso datos que se modifican con el tipo de animacion (fade-in, fade-out, etc)
        let animation_type = this.animation_data[animation[key][index].type];

        // setea el tiempo de duracion de la animacion
        this.animation[key][index][this.DURATION] = animation[key][index][this.DURATION];

        // cambia los valores de la animacion dependiendo del tipo de animacion
        Object.entries(animation_type).forEach(([key_animation, value_animation]) => {
            // en el caso de tener operaciones las calcula
            let value = this.translate_animation(value_animation, key, index, animation, data)
            this.animation[key][index][key_animation] = value;
            this.animation[key][index][key_animation] = value;

            // si la animacion es de tipo "end" se los guarda para que la siguiente animacion lo use
            if (key_animation.endsWith('_end')) {
                data_assistant[key_animation.slice(0, -4)] = value;
            }
        });
    }

    // traduce las animaciones que tienen operaciones
    translate_animation(value, key, index, animation, data) {
        // ej: $pos_x_start {add} 10

        // si no es un string (es un numero) directamente lo devuelve
        if (typeof value !== 'string') return value;

        const info = [];
        let buffer = '';
        let i = 0;
        let operation = '';

        // recorre el string
        while (i < value.length) {
            let char = value[i];
        
            // números
            if (/\d/.test(char)) {
                const { result: numStr, nextIndex } = this.readWhile(value, i, /\d/);   // /\d/ para leer solo números
                info.push(parseInt(numStr));
                i = nextIndex;
                continue;
            }
        
            // contenido entre llaves: {operation}
            if (char === '{') {
                const { result: braceStr, nextIndex } = this.readBetween(value, i + 1, '}');
                operation = braceStr;
                i = nextIndex;
                continue;
            }
        
            // contenido entre corchetes: [data]
            if (char === '[') {
                const { result: bracketStr, nextIndex } = this.readBetween(value, i + 1, ']');
                info.push({ bracketsContent: bracketStr });
                i = nextIndex;
                continue;
            }
        
            // variables tipo $nombre
            if (char === '$') {
                const { result: varName, nextIndex } = this.readWhile(value, i + 1, /[^\s\{\}\[\]\$]/); // [^\s\{\}\[\]\$] para leer solo letras y números -> ^ == niega los siguiente: \s = espacio, \{ =  llave, \[ = corchete, \$ = dolar
                info.push({ variable: varName });
                i = nextIndex;
                continue;
            }
        
            i++; // si no matchea nada, avanza
        }
        

        // agregar el texto plano restante si existe
        if (buffer.trim()) {
            info.push(buffer.trim());
        }

        // guardamos los datos en orden para la operacion
        let operations = [];
        info.forEach((item) => {
            if (Number.isInteger(item)) {
                operations.push(item);
            } else if (item.variable) {
                let variable = item.variable.split('_');
                variable.pop();
                variable = variable.join('_');

                operations.push(data[variable]);
            } else if (item.bracketsContent) {
                operations.push(animation[key][index].var[item.bracketsContent]);
            }
        });

        if (operations.length < 2) {
            return operations[0];
        }
        // devuelve el valor de la operacion
        return this.operation_animation(operations[0], operations[1], operation);
    }

    // Lee una cadena entre delimitadores como {}, [], etc.
    readBetween(value, startIndex, endChar) {
        let result = '';
        let i = startIndex;
        while (i < value.length && value[i] !== endChar) {
            result += value[i];
            i++;
        }
        return { result, nextIndex: i + 1 }; // i + 1 para saltar el delimitador de cierre
    }

    // Lee mientras se cumpla una condición, como dígitos o nombre de variable
    readWhile(value, startIndex, conditionRegex) {
        let result = '';
        let i = startIndex;
        while (i < value.length && conditionRegex.test(value[i])) {
            result += value[i];
            i++;
        }
        return { result, nextIndex: i };
    }



    // realiza la operacion dependiendo de la que se le pase
    operation_animation(value1, value2, operation) {
        switch (operation) {
            case "add":
                return value1 + value2;
            case "sub":
                return value1 - value2;
            case "mul":
                return value1 * value2;
            case "div":
                return value1 / value2;
            default:
                console.log("No se ha encontrado la operacion: " + operation);
                break;
        }
    }

}

export default Animation;