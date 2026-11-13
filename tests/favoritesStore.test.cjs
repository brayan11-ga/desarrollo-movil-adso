const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { compileFunction } = require("node:vm");
const ts = require("typescript");

const storageKey = "cleanpro-favorites";
const storePath = path.join(__dirname, "../src/stores/favoritesStore.ts");
const compiledStore = ts.transpileModule(readFileSync(storePath, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
});

// Ejecutamos el store real con Zustand; solo reemplazamos el almacenamiento nativo.
function loadStore(storage) {
  const storeModule = { exports: {} };
  const evaluate = compileFunction(
    compiledStore.outputText,
    ["require", "module", "exports"],
    { filename: storePath },
  );

  evaluate(
    (name) =>
      name === "@react-native-async-storage/async-storage"
        ? storage
        : require(name),
    storeModule,
    storeModule.exports,
  );

  return storeModule.exports.useFavoritesStore;
}

function createStorage(favoriteIds) {
  const entries = new Map();
  const writes = [];

  if (favoriteIds) {
    entries.set(
      storageKey,
      JSON.stringify({ state: { favoriteIds }, version: 0 }),
    );
  }

  return {
    entries,
    writes,
    async getItem(key) {
      return entries.get(key) ?? null;
    },
    async setItem(key, value) {
      writes.push({ key, value });
      entries.set(key, value);
    },
    async removeItem(key) {
      entries.delete(key);
    },
  };
}

function waitForHydration(store) {
  if (store.persist.hasHydrated()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsubscribe = store.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
}

test("inicia vacío y termina la hidratación sin escribir en disco", { timeout: 2000 }, async () => {
  const storage = createStorage();
  const store = loadStore(storage);

  assert.equal(store.getState().hydrationStatus, "loading");
  await waitForHydration(store);

  assert.equal(store.getState().hydrationStatus, "ready");
  assert.deepEqual(store.getState().favoriteIds, []);
  assert.equal(storage.writes.length, 0);
});

test("agrega sin duplicados y elimina sin mutar los arrays anteriores", { timeout: 2000 }, async () => {
  const store = loadStore(createStorage());
  await waitForHydration(store);

  const emptyIds = Object.freeze(store.getState().favoriteIds);
  const { addFavorite, removeFavorite } = store.getState();
  addFavorite("service-office");
  const firstIds = Object.freeze(store.getState().favoriteIds);
  addFavorite("service-office");
  addFavorite("service-windows");
  const bothIds = Object.freeze(store.getState().favoriteIds);

  assert.deepEqual(emptyIds, []);
  assert.deepEqual(firstIds, ["service-office"]);
  assert.deepEqual(bothIds, ["service-office", "service-windows"]);

  removeFavorite("service-office");
  removeFavorite("service-office");
  removeFavorite("servicio-inexistente");
  assert.deepEqual(store.getState().favoriteIds, ["service-windows"]);
  assert.deepEqual(bothIds, ["service-office", "service-windows"]);

  removeFavorite("service-windows");
  assert.deepEqual(store.getState().favoriteIds, []);
  assert.equal(store.getState().addFavorite, addFavorite);
  assert.equal(store.getState().removeFavorite, removeFavorite);
});

test("persiste únicamente los IDs bajo cleanpro-favorites", { timeout: 2000 }, async () => {
  const storage = createStorage();
  const store = loadStore(storage);
  await waitForHydration(store);

  store.getState().addFavorite("service-office");
  const saved = JSON.parse(storage.entries.get(storageKey));

  assert.deepEqual(saved.state, { favoriteIds: ["service-office"] });
  assert.deepEqual([...storage.entries.keys()], [storageKey]);
  assert.equal(storage.writes.length, 1);
});

test("un store nuevo recupera las altas y bajas persistidas", { timeout: 2000 }, async () => {
  const storage = createStorage();
  const firstStore = loadStore(storage);
  await waitForHydration(firstStore);
  firstStore.getState().addFavorite("service-office");
  firstStore.getState().addFavorite("service-windows");
  firstStore.getState().removeFavorite("service-office");

  const restoredStore = loadStore(storage);
  await waitForHydration(restoredStore);

  assert.deepEqual(restoredStore.getState().favoriteIds, ["service-windows"]);
  assert.equal(restoredStore.getState().hydrationStatus, "ready");
});

test("mantiene loading hasta que finaliza la lectura asíncrona", { timeout: 2000 }, async () => {
  const storage = createStorage(["service-office"]);
  let finishRead;
  storage.getItem = () => new Promise((resolve) => { finishRead = resolve; });
  const store = loadStore(storage);
  const hydrated = waitForHydration(store);

  assert.equal(store.getState().hydrationStatus, "loading");
  assert.equal(store.persist.hasHydrated(), false);
  assert.equal(storage.writes.length, 0);

  finishRead(storage.entries.get(storageKey));
  await hydrated;

  assert.equal(store.getState().hydrationStatus, "ready");
  assert.deepEqual(store.getState().favoriteIds, ["service-office"]);
  assert.equal(storage.writes.length, 0);
});

test("un error de lectura permite reintentar sin sobrescribir los favoritos", { timeout: 2000 }, async (context) => {
  const storage = createStorage(["service-office"]);
  const saved = storage.entries.get(storageKey);
  const readItem = storage.getItem;
  storage.getItem = async () => { throw new Error("Lectura no disponible"); };
  const errorLog = context.mock.method(console, "error", () => {});
  const store = loadStore(storage);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(store.getState().hydrationStatus, "error");
  assert.equal(store.persist.hasHydrated(), false);
  assert.equal(storage.entries.get(storageKey), saved);
  assert.equal(storage.writes.length, 0);
  assert.equal(errorLog.mock.callCount(), 1);

  storage.getItem = readItem;
  const retry = store.persist.rehydrate();
  assert.equal(store.getState().hydrationStatus, "loading");
  await retry;

  assert.equal(store.getState().hydrationStatus, "ready");
  assert.deepEqual(store.getState().favoriteIds, ["service-office"]);
  assert.equal(storage.writes.length, 0);
});

test("un JSON ilegible muestra error y conserva el contenido para recuperarlo", { timeout: 2000 }, async (context) => {
  const storage = createStorage();
  storage.entries.set(storageKey, "{incompleto");
  context.mock.method(console, "error", () => {});
  const store = loadStore(storage);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(store.getState().hydrationStatus, "error");
  assert.equal(storage.entries.get(storageKey), "{incompleto");
  assert.equal(storage.writes.length, 0);
});

test("la suscripción al total refleja altas, duplicados y bajas", { timeout: 2000 }, async () => {
  const store = loadStore(createStorage());
  await waitForHydration(store);
  const counts = [];
  const unsubscribe = store.subscribe((state, previous) => {
    if (state.favoriteIds.length !== previous.favoriteIds.length) {
      counts.push(state.favoriteIds.length);
    }
  });

  store.getState().addFavorite("service-office");
  store.getState().addFavorite("service-office");
  store.getState().addFavorite("service-windows");
  store.getState().removeFavorite("service-office");
  store.getState().removeFavorite("service-windows");
  unsubscribe();

  assert.deepEqual(counts, [1, 2, 1, 0]);
});
