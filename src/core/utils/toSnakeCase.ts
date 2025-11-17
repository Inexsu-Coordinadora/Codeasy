export function toSnakeCase(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => toSnakeCase(item));
  }

  // NO tratar strings ni fechas como objetos
  if (
    input !== null &&
    typeof input === "object" &&
    !Array.isArray(input) &&
    !(input instanceof Date) &&
    typeof input !== "string"
  ) {
    const newObj: any = {};

    for (const key in input) {
      if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

      const value = input[key];

      const snakeKey = key
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase();

      if (value !== undefined) {
        newObj[snakeKey] = toSnakeCase(value);
      }
    }

    return newObj;
  }

  // Las fechas y strings llegan aquí SIN romperse
  return input;
}
