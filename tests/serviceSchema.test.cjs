const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { compileFunction } = require("node:vm");
const { zodResolver } = require("@hookform/resolvers/zod");
const ts = require("typescript");

// Ejecuta el schema real, siguiendo la carga de TypeScript usada en las pruebas de favoritos.
const schemaPath = path.join(__dirname, "../src/schemas/serviceSchema.ts");
const compiledSchema = ts.transpileModule(readFileSync(schemaPath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const schemaModule = { exports: {} };
compileFunction(compiledSchema.outputText, ["require", "module", "exports"], {
  filename: schemaPath,
})(require, schemaModule, schemaModule.exports);
const { serviceSchema } = schemaModule.exports;

const validService = {
  name: "Limpieza de oficina",
  description: "Limpieza general",
  category: "Comercial",
  price: "50000",
  duration: "2 horas",
  image: "",
};

test("convierte el precio a número y elimina espacios en los textos", () => {
  const result = serviceSchema.parse({ ...validService, name: "  Limpieza de oficina  " });
  assert.equal(result.price, 50000);
  assert.equal(result.name, "Limpieza de oficina");
});

test("rechaza nombre corto y campos obligatorios vacíos con mensajes en español", () => {
  for (const [field, value, message] of [
    ["name", "A", "Escribe un nombre de al menos 2 caracteres."],
    ["category", "   ", "Escribe la categoría del servicio."],
    ["duration", "", "Escribe la duración del servicio."],
  ]) {
    const result = serviceSchema.safeParse({ ...validService, [field]: value });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].path[0], field);
    assert.equal(result.error.issues[0].message, message);
  }
});

test("rechaza precio vacío, cero, negativo o no numérico", () => {
  for (const price of ["", "0", "-1", "texto", "Infinity"]) {
    assert.equal(serviceSchema.safeParse({ ...validService, price }).success, false);
  }
});

test("permite campos opcionales omitidos y valida la URL de imagen", () => {
  const { description, image, ...requiredFields } = validService;
  assert.equal(serviceSchema.safeParse(requiredFields).success, true);
  assert.equal(serviceSchema.safeParse(validService).success, true);
  assert.equal(serviceSchema.safeParse({ ...validService, image: "https://example.com/limpieza.jpg" }).success, true);
  assert.equal(serviceSchema.safeParse({ ...validService, image: "imagen incorrecta" }).success, false);
});

test("zodResolver entrega errores por campo y un precio numérico al validar", async () => {
  const resolveForm = zodResolver(serviceSchema);
  const options = { fields: {}, shouldUseNativeValidation: false };
  const invalidResult = await resolveForm({
    name: "", description: "", category: "", price: "", duration: "", image: "incorrecta",
  }, undefined, options);
  assert.deepEqual(Object.keys(invalidResult.errors).sort(), ["category", "duration", "image", "name", "price"]);

  const validResult = await resolveForm(validService, undefined, options);
  assert.deepEqual(validResult.errors, {});
  assert.equal(validResult.values.price, 50000);
});
