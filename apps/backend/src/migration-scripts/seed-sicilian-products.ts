import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

const img = (name: string) => ({ url: `/products/${name}.svg` });

export default async function seed_sicilian_products({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Looking up existing store data...");

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const defaultSalesChannel = salesChannels[0];

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfiles[0];

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  });
  const stockLocation = stockLocations[0];

  if (!defaultSalesChannel || !shippingProfile || !stockLocation) {
    logger.warn(
      "Missing sales channel, shipping profile, or stock location. Run the initial data seed first."
    );
    return;
  }

  logger.info("Seeding Sicilian craft categories...");

  const categoryNames = [
    "Caltagirone Ceramics",
    "Coral & Jewelry",
    "Baskets & Textiles",
    "Olive Wood",
    "Pupi & Decor",
  ];

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: categoryNames },
  });

  const missingCategoryNames = categoryNames.filter(
    (name) => !existingCategories.some((c) => c.name === name)
  );

  let categoryResult = existingCategories;
  if (missingCategoryNames.length) {
    const { result: created } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: missingCategoryNames.map((name) => ({
          name,
          is_active: true,
        })),
      },
    });
    categoryResult = [...existingCategories, ...created];
  }

  const categoryId = (name: string) =>
    categoryResult.find((c) => c.name === name)!.id;

  logger.info("Seeding product options...");

  const { result: optionsResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        { title: "Glaze", values: ["Maiolica Blue", "Lemon Yellow"] },
        { title: "Basket Size", values: ["Small", "Large"] },
        { title: "Cap Size", values: ["S", "M", "L"] },
        { title: "Character", values: ["Knight", "Saracen"] },
        { title: "Edition", values: ["One of a kind"] },
      ],
    },
  });

  const option = (title: string) =>
    optionsResult.find((o) => o.title === title)!;

  const eur = (amount: number) => [
    { amount, currency_code: "eur" },
    { amount: Math.round(amount * 1.1), currency_code: "usd" },
  ];

  logger.info("Seeding Sicilian products...");

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Testa di Moro Ceramic Vase",
          category_ids: [categoryId("Caltagirone Ceramics")],
          description:
            "A hand-painted ceramic vase inspired by the Sicilian legend of the Moor's Head, glazed and fired by master ceramicists in Caltagirone. Each piece is one of a kind, with small variations that mark it as handmade.",
          handle: "testa-di-moro-ceramic-vase",
          weight: 1200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("testa-di-moro")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-TESTAMORO-001",
              options: { Edition: "One of a kind" },
              prices: eur(89),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Trinacria Vase, Hand-Painted",
          category_ids: [categoryId("Caltagirone Ceramics")],
          description:
            "A ceramic vase decorated with the Trinacria, the ancient three-legged symbol of Sicily, entirely shaped and hand-painted by local artisans.",
          handle: "trinacria-vase",
          weight: 900,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("vaso-trinacria")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-TRINACRIA-001",
              options: { Edition: "One of a kind" },
              prices: eur(65),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Caltagirone Decorative Plate",
          category_ids: [categoryId("Caltagirone Ceramics")],
          description:
            "A glazed ceramic wall plate hand-painted with the floral and geometric motifs typical of Sicilian majolica.",
          handle: "caltagirone-decorative-plate",
          weight: 600,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("piatto-decorativo")],
          options: [{ id: option("Glaze").id }],
          variants: [
            {
              title: "Maiolica Blue",
              sku: "SIC-PIATTO-BLU",
              options: { Glaze: "Maiolica Blue" },
              prices: eur(38),
            },
            {
              title: "Lemon Yellow",
              sku: "SIC-PIATTO-GIALLO",
              options: { Glaze: "Lemon Yellow" },
              prices: eur(38),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Sciacca Red Coral Necklace",
          category_ids: [categoryId("Coral & Jewelry")],
          description:
            "A handcrafted necklace featuring red coral worked by artisans in Sciacca, set on a 925 silver chain.",
          handle: "sciacca-red-coral-necklace",
          weight: 60,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("collana-corallo")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-COLLANA-001",
              options: { Edition: "One of a kind" },
              prices: eur(145),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Coral Drop Earrings",
          category_ids: [categoryId("Coral & Jewelry")],
          description:
            "Drop earrings handmade with natural Sicilian coral and silver findings.",
          handle: "coral-drop-earrings",
          weight: 20,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("orecchini-corallo")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-ORECCHINI-001",
              options: { Edition: "One of a kind" },
              prices: eur(68),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Sicilian Wicker Basket",
          category_ids: [categoryId("Baskets & Textiles")],
          description:
            "A basket hand-woven from local cane and wicker, ideal for the market, for bread, or as a decorative piece.",
          handle: "sicilian-wicker-basket",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("cesta-vimini")],
          options: [{ id: option("Basket Size").id }],
          variants: [
            {
              title: "Small",
              sku: "SIC-CESTA-S",
              options: { "Basket Size": "Small" },
              prices: eur(28),
            },
            {
              title: "Large",
              sku: "SIC-CESTA-L",
              options: { "Basket Size": "Large" },
              prices: eur(42),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Hand-Embroidered Linen Tablecloth",
          category_ids: [categoryId("Baskets & Textiles")],
          description:
            "A pure linen tablecloth, hand-embroidered with traditional Sicilian motifs by a family textile workshop.",
          handle: "embroidered-linen-tablecloth",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("tovaglia-ricamata")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-TOVAGLIA-001",
              options: { Edition: "One of a kind" },
              prices: eur(76),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Sicilian Linen Coppola Cap",
          category_ids: [categoryId("Baskets & Textiles")],
          description:
            "The classic Sicilian coppola flat cap, hand-sewn in pure linen, perfect for warm summer days.",
          handle: "sicilian-coppola-cap",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("coppola")],
          options: [{ id: option("Cap Size").id }],
          variants: [
            {
              title: "S",
              sku: "SIC-COPPOLA-S",
              options: { "Cap Size": "S" },
              prices: eur(34),
            },
            {
              title: "M",
              sku: "SIC-COPPOLA-M",
              options: { "Cap Size": "M" },
              prices: eur(34),
            },
            {
              title: "L",
              sku: "SIC-COPPOLA-L",
              options: { "Cap Size": "L" },
              prices: eur(34),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Olive Wood Cutting Board",
          category_ids: [categoryId("Olive Wood")],
          description:
            "A kitchen cutting board carved from a single block of Sicilian olive wood, each with its own unique grain.",
          handle: "olive-wood-cutting-board",
          weight: 800,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("tagliere-ulivo")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-TAGLIERE-001",
              options: { Edition: "One of a kind" },
              prices: eur(42),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Olive Wood Spoon Set",
          category_ids: [categoryId("Olive Wood")],
          description:
            "A set of three kitchen spoons hand-carved from olive wood, sturdy and naturally antibacterial.",
          handle: "olive-wood-spoon-set",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("cucchiai-ulivo")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-CUCCHIAI-001",
              options: { Edition: "One of a kind" },
              prices: eur(24),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Collectible Sicilian Pupo",
          category_ids: [categoryId("Pupi & Decor")],
          description:
            "A collectible Sicilian marionette (pupo), fully carved and hand-painted in the tradition of the Opera dei Pupi, with an embossed metal suit of armor.",
          handle: "collectible-sicilian-pupo",
          weight: 1500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("pupo-siciliano")],
          options: [{ id: option("Character").id }],
          variants: [
            {
              title: "Knight",
              sku: "SIC-PUPO-CAVALIERE",
              options: { Character: "Knight" },
              prices: eur(120),
            },
            {
              title: "Saracen",
              sku: "SIC-PUPO-SARACENO",
              options: { Character: "Saracen" },
              prices: eur(120),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Miniature Sicilian Cart",
          category_ids: [categoryId("Pupi & Decor")],
          description:
            "A miniature reproduction of the traditional Sicilian cart (carretto), hand-painted with folk scenes and decorative motifs.",
          handle: "miniature-sicilian-cart",
          weight: 700,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [img("carretto-siciliano")],
          options: [{ id: option("Edition").id }],
          variants: [
            {
              title: "One of a kind",
              sku: "SIC-CARRETTO-001",
              options: { Edition: "One of a kind" },
              prices: eur(58),
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  });

  logger.info("Finished seeding Sicilian products.");

  logger.info("Seeding inventory levels for new products...");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
    filters: { location_id: stockLocation.id },
  });
  const stockedIds = new Set(existingLevels.map((l) => l.inventory_item_id));

  const unstockedItems = inventoryItems.filter((i) => !stockedIds.has(i.id));

  if (unstockedItems.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: unstockedItems.map((item) => ({
          location_id: stockLocation.id,
          stocked_quantity: 1000,
          inventory_item_id: item.id,
        })),
      },
    });
  }

  logger.info("Finished seeding inventory levels.");
}
