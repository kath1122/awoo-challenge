const axios = require('axios');

const base_url = 'https://pokeapi.co/api/v2/item';

async function getItemData(idOrName) {
  try {
    const response = await axios.get(`${base_url}/${idOrName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item data: ${error}`);
    return null;
  }
}

async function getItemCount() {
  try {
    const response = await axios.get(`${base_url}/`);
    return response.data.count;
  } catch (error) {
    console.error(`Error fetching item count: ${error}`);
    return null;
  }
}

async function listItemsByIdRange(startId, endId) {
  console.log('2. id < 20, id > 0 的寶可夢物品名稱（name），依照 id 由小至大排序')
  for (let id = startId; id <= endId; id++) {
    const itemData = await getItemData(id);
    if (itemData) {
      console.log(`${itemData.name}`);
    }
  }
}

async function listItemsByCost(maxCost) {
  try {
    const itemCount = await getItemCount();
    if (!itemCount) return;

    const items = [];
    for (let id = 1; id < itemCount && id < 50; id++) {
      const itemData = await getItemData(id);
      if (itemData && itemData.cost <= maxCost) {
        items.push({ name: itemData.name, cost: itemData.cost });
      }
    }

    const sortedItems = items.sort((a, b) => b.cost - a.cost);

    console.log('3. 價格 ≤ 1500 的寶可夢物品名稱（name）及寶可夢物品價格（cost）:');
    for (const item of sortedItems) {
      console.log(`   名稱: ${item.name}, 價格: ${item.cost}`);
    }
  } catch (error) {
    console.error(`Error listing items by cost: ${error}`);
  }
}

(async () => {
  // 1. 列出 item 總數量（count）
  const itemCount = await getItemCount();
  if (itemCount) {
    console.log(`1. 寶可夢物品總數量（count）: ${itemCount}`);
  }

  // 2. 列出 id < 20, id > 0 的寶可夢物品名稱（name），依照 id 由小至大排序
  await listItemsByIdRange(1, 19);

  // 3. 列出 id < 50, id > 0 的寶可夢物品中，價格（cost）≤ 1500 的寶可夢物品名稱（name）及寶可夢物品價格（cost），並且依照花費價格（cost）由大至小排序
  await listItemsByCost(1500);
})();
