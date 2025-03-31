import { DATA_INFO } from "/src/data/scene_data.js";

class PantallaAnimation {
    constructor(scene) {
        this.animation = {};

        this.DURATION = "duration";

        // carga los jsons
        this.data_json = scene.scene.get(DATA_INFO).get_data_json().Json;
        this.animation_data = scene.scene.get(DATA_INFO).get_json(this.data_json.PantallaAnimation);
    }

    // setea las animaciones a valores default
    set_animation(data) {
        let animation = {};
        Object.entries(data).forEach(([key, value]) => {
            animation[key + "_start"] = value;
            animation[key + "_end"] = value;
        });
        return animation;
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
            Object.entries(data_assistant).forEach(([data_assistant_key, data_assistant_value]) => {
                data[data_assistant_key] = data_assistant[data_assistant_key];
            });

            // se mueve por cada una de las animaciones que se ejecutan a la vez
            value.forEach((val) => {
                // setea los valores default de la animacion
                let val_set_data = this.set_animation(data);

                // añade dichos valores a la animacion
                this.animation[key].push(val_set_data);

                // setea los valores de la animacion
                let index = this.animation[key].length - 1;
                this.get_animation(data_assistant, animation, key, index);
            });
        });

        // devuelve los datos de la animacion
        return this.animation;
    }

    // setea los valores de la animacion
    get_animation(data_assistant, animation, key, index) {
        // obtiene lso datos que se modifican con el tipo de animacion (fade-in, fade-out, etc)
        let animation_type = this.animation_data[animation[key][index].type];

        // setea el tiempo de duracion de la animacion
        this.animation[key][index][this.DURATION] = animation[key][index][this.DURATION];

        // cambia los valores de la animacion dependiendo del tipo de animacion
        Object.entries(animation_type).forEach(([key_animation, value_animation]) => {
            // en el caso de tener operaciones las calcula
            let value = this.translate_animation(value_animation, key, index)
            this.animation[key][index][key_animation] = value;

            // si la animacion es de tipo "end" se los guarda para que la siguiente animacion lo use
            if (key_animation.endsWith('_end')) {
                data_assistant[key_animation.slice(0, -4)] = value;
            }
        });
    }

    // traduce las animaciones que tienen operaciones
    translate_animation(value, key, index) {
        // ej: $pos_x_start {add} 10

        // si no es un string (es un numero) directamente lo devuelve
        if (typeof value !== 'string') return value;
    
        const info = [];
        let buffer = '';
        let inBraces = false;
        let braceContent = '';
        let i = 0;
        let operation = '';
    
        // recorre el string
        while (i < value.length) {
            const char = value[i];
    
            // si es un número (dígito) y no estamos leyendo otra cosa
            if (!inBraces && /\d/.test(char)) {
                let numStr = char;
                i++;              
                // sigue leyendo números hasta que no haya más
                while (i < value.length && /\d/.test(value[i])) {
                    numStr += value[i];
                    i++;
                }
                // lo convierte a número y lo añade al array de info
                info.push(parseInt(numStr));
                continue;
            }
    
            // si encontramos { obtenemos el contenido entre llaves
            if (char === '{') {
                inBraces = true;
                braceContent = '';
                i++;
                continue;
            }
    
            if (char === '}' && inBraces) {
                inBraces = false;
                // si encontramos } y ya teníamos algo en braceContent, lo añadimos a la operacion (add, sub, etc)
                operation = braceContent;
                i++;
                continue;
            }
    
            if (inBraces) {
                braceContent += char;
                i++;
                continue;
            }
    
            // si encontramos $
            if (char === '$') {
                let varName = '';
                i++;
                // lee el nombre de la variable hasta que encuentre un espacio o un caracter no válido
                while (i < value.length && !/\s/.test(value[i])) {
                    varName += value[i];
                    i++;
                }
                // añade la variable al array de info como un objeto con la propiedad variable
                info.push({ variable: varName });
                continue;
            }
    
            // si es cualquier otra letra o espacio
            buffer += char;
            i++;
        }
    
        // agregar el texto plano restante si existe
        if (buffer.trim()) {
            info.push(buffer.trim());
        }

        // guardamos los datos en orden para la operacion
        let operations = [];
        info.forEach((item, index) => {
            if (Number.isInteger(item)) {
                operations.push(item);
            } else if (item.variable) {
                operations.push(this.animation[key][index][item.variable]);
            }
        });

        // devuelve el valor de la operacion
        return this.operation_animation(operations[0], operations[1], operation);
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

export default PantallaAnimation;