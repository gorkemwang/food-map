const STORAGE_KEY = 'task1-web-ui-restaurants-added';
/** 每次进入餐厅列表时写入的 restaurants.json（打包静态数据）快照 */
const JSON_SNAPSHOT_KEY = 'task1-web-ui-restaurants-json-snapshot';

export function loadUserAddedRestaurants() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserAddedRestaurants(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function nextRestaurantId(baseList, addedList) {
  const combined = [...baseList, ...addedList];
  return combined.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1;
}

/**
 * 将静态 restaurants.json（打包后的数组）完整写入 localStorage，便于离线或其它逻辑读取。
 * @param {unknown[]} restaurantsArray
 */
export function saveRestaurantsJsonSnapshot(restaurantsArray) {
  if (!Array.isArray(restaurantsArray)) return;
  localStorage.setItem(JSON_SNAPSHOT_KEY, JSON.stringify(restaurantsArray));
}
