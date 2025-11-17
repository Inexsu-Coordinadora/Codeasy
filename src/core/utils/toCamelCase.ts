export function toCamelCase(input: any): any {
  if (Array.isArray(input)) {
    return input.map((item) => toCamelCase(item));
  }

  // NO procesar como objeto si es string, Date u otro tipo primitivo
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

      // convierte snake_case → camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, char) =>
        char.toUpperCase()
      );

      newObj[camelKey] = toCamelCase(input[key]);
    }

    return newObj;
  }

  // Las fechas y strings llegan aquí intactas
  return input;
}
