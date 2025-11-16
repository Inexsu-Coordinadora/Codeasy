export function toSnakeCase(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => toSnakeCase(item));
  }

  if (input !== null && typeof input === "object") {
    const newObj: any = {};

    for (const key in input) {
      if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

      const value = input[key];

      // Convierte camelCase → snake_case
      const snakeKey = key
        .replace(/([A-Z])/g, "_$1") // agrega _
        .toLowerCase();

      // Evita guardar undefined en la BD
      if (value !== undefined) {
        newObj[snakeKey] = toSnakeCase(value);
      }
    }

    return newObj;
  }

  return input; // valores primitivos
}
