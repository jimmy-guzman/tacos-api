import { faker } from "@faker-js/faker";
import { db } from "@/db/client";
import { tacosTable } from "@/db/schemas/tacos";

const fillings = [
  "nopales",
  "carnitas",
  "carne asada",
  "pollo",
  "al pastor",
  "barbacoa",
  "lengua",
  "rajas",
  "calabacitas",
  "hongos",
  "pescado",
];

const toppings = [
  "cilantro",
  "onion",
  "lime",
  "salsa verde",
  "salsa roja",
  "pico de gallo",
  "guacamole",
  "crema",
  "queso fresco",
  "radish",
  "cabbage",
  "pickled onions",
];

function generateTaco() {
  const numToppings = faker.number.int({ max: 5, min: 2 });
  const selectedToppings = faker.helpers.arrayElements(toppings, numToppings);

  return {
    filling: faker.helpers.arrayElement(fillings),
    name: `${faker.word.adjective()} ${faker.helpers.arrayElement(fillings)} taco`,
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
      probability: 0.6,
    }),
    toppings: selectedToppings,
  };
}

async function seed() {
  // biome-ignore lint/suspicious/noConsole: this is a script
  console.log("🌮 Seeding tacos...");

  const tacos = Array.from({ length: 50 }, generateTaco);

  await db.insert(tacosTable).values(tacos);

  // biome-ignore lint/suspicious/noConsole: this is a script
  console.log(`✅ Seeded ${tacos.length} tacos`);
}

seed()
  .catch((error) => {
    // biome-ignore lint/suspicious/noConsole: this is a script
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
