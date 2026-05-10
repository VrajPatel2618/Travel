import assert from "node:assert/strict";
import test from "node:test";

import {
  formatCurrency,
  formatDateRange,
  groupPackingItems,
  mapBudgetBreakdown,
  mapCityToDestination,
  mapTripToCard,
  numberFrom
} from "./api-mappers";

test("mapTripToCard converts API trip shape into UI card data", () => {
  const card = mapTripToCard({
    id: "trip_1",
    title: "Spring in Japan",
    startDate: "2026-04-02T00:00:00.000Z",
    endDate: "2026-04-13T00:00:00.000Z",
    budgetAmount: "5680",
    currency: "USD",
    status: "PLANNING",
    coverImageUrl: null,
    destinations: [
      {
        id: "destination_1",
        position: 1,
        startDate: "2026-04-02T00:00:00.000Z",
        endDate: "2026-04-05T00:00:00.000Z",
        stayNights: 3,
        city: {
          id: "city_1",
          name: "Tokyo",
          country: "Japan",
          imageUrl: "https://example.com/tokyo.jpg"
        }
      }
    ]
  });

  assert.equal(card.title, "Spring in Japan");
  assert.equal(card.dates, "Apr 2 - Apr 13, 2026");
  assert.deepEqual(card.cities, ["Tokyo"]);
  assert.equal(card.budget, "$5,680");
  assert.equal(card.progress, 72);
  assert.equal(card.image, "https://example.com/tokyo.jpg");
});

test("city, money, and budget mappers produce stable display values", () => {
  assert.equal(numberFrom("$5,500"), 5500);
  assert.equal(formatCurrency("42.4"), "$42");
  assert.equal(formatDateRange("2026-12-28T00:00:00.000Z", "2027-01-03T00:00:00.000Z"), "Dec 28, 2026 - Jan 3, 2027");

  assert.deepEqual(mapBudgetBreakdown({ HOTELS: 1200 })[0], {
    name: "Hotels",
    value: 1200,
    fill: "#2563eb"
  });

  assert.equal(
    mapCityToDestination({
      id: "city_2",
      name: "Kyoto",
      country: "Japan",
      costIndex: 72,
      popularityScore: 94,
      bestMonths: ["April", "May"]
    }).cost,
    "$$$"
  );
});

test("groupPackingItems groups API items by category title", () => {
  const groups = groupPackingItems([
    { id: "1", category: "DOCUMENTS", name: "Passport", quantity: 1, isPacked: true },
    { id: "2", category: "DOCUMENTS", name: "Insurance", quantity: 1, isPacked: false },
    { id: "3", category: "ELECTRONICS", name: "Adapter", quantity: 2, isPacked: false }
  ]);

  assert.equal(groups.length, 2);
  assert.equal(groups[0].title, "Documents");
  assert.equal(groups[0].items.length, 2);
  assert.equal(groups[1].items[0].quantity, 2);
});
