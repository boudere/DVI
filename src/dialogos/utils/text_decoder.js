class TextDecoder {
    constructor() {}

    decode(text) {
        const types = [];
        const values = [];
        let resultText = '';

        // Patrón combinado: variables $variable, {sprite=algo}, {sound=algo}
        const pattern = /\$([a-zA-Z_]\w*)|\{(sprite|sound)=([^}]+)\}/g;
        let lastIndex = 0;

        let match;
        while ((match = pattern.exec(text)) !== null) {
            // Añadimos el texto entre el final del último match y el inicio del nuevo
            resultText += text.slice(lastIndex, match.index);
            lastIndex = pattern.lastIndex;

            if (match[1]) {
                // Es una variable tipo $nombre
                types.push('variable');
                values.push(match[1]);
            } else if (match[2] === 'sprite') {
                types.push('sprite');
                values.push(match[3]);
            } else if (match[2] === 'sound') {
                types.push('sound');
                values.push(match[3]);
            }

            resultText += '@'; // Indicador de marcador especial
        }

        // Añadir el resto del texto si queda algo después del último match
        resultText += text.slice(lastIndex);

        return {
            text: resultText,
            types: types,
            values: values
        };
    }
}

export default TextDecoder;
