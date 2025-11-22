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
  if (input !== null && typeof input === "object") {
    const newObj: any = {};

    for (const key in input) {
      if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
      newObj[camelKey] = toCamelCase(input[key]);
    }

    return newObj;
  }

  return input;
  }
}
