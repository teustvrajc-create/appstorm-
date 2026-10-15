// Имитация сервера. Чтобы подключить настоящий API, замените тела
// функций на fetch('https://...') — экранам менять ничего не нужно.

export const CITIES = ['Астана', 'Алматы', 'Шымкент', 'Қарағанды', 'Ақтау'];

export const CATEGORIES = [
  'Все',
  'Кофе',
  'Ресторан',
  'Фастфуд',
  'Суши',
  'Пицца',
  'Чайхана',
];

export type Place = {
  id: string;
  name: string;
  category: string;
  emoji: string;
  city: string;
  rating: number;
  street: string;
  house: number;
  phone: string;
  description: string;
};

const TEMPLATES = [
  { name: 'Aroma Coffee', category: 'Кофе', emoji: '☕', description: 'Свежеобжаренный кофе, десерты и уютная атмосфера для работы и встреч.' },
  { name: 'Дастархан', category: 'Ресторан', emoji: '🍽️', description: 'Национальная кухня: бешбармак, манты, баурсаки и домашние супы.' },
  { name: 'Burger Lab', category: 'Фастфуд', emoji: '🍔', description: 'Сочные бургеры из мраморной говядины, картофель фри и milkshake.' },
  { name: 'Sushi Time', category: 'Суши', emoji: '🍣', description: 'Роллы и сеты на любой вкус, доставка за 30 минут.' },
  { name: 'Napoli Pizza', category: 'Пицца', emoji: '🍕', description: 'Пицца на тонком тесте из дровяной печи по итальянскому рецепту.' },
  { name: 'Алтын Чайхана', category: 'Чайхана', emoji: '🫖', description: 'Ароматный чай, плов и самса. Тапчаны и восточный уют.' },
];

const STREETS = ['Абая', 'Достык', 'Сарыарка', 'Мира', 'Независимости', 'Назарбаева'];

function allPlaces(): Place[] {
  const list: Place[] = [];
  CITIES.forEach((city, c) => {
    TEMPLATES.forEach((t, i) => {
      list.push({
        id: `${c}-${i}`,
        name: t.name,
        category: t.category,
        emoji: t.emoji,
        city,
        rating: 4 + ((c * 3 + i * 7) % 10) / 10,
        street: STREETS[i],
        house: (i + 1) * 7,
        phone: `+7 (700) 555 ${10 + i} ${20 + c}`,
        description: t.description,
      });
    });
  });
  return list;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchPlaces(city: string): Promise<Place[]> {
  await sleep(600);
  return allPlaces().filter((p) => p.city === city);
}

export async function fetchPlace(id: string): Promise<Place | undefined> {
  await sleep(300);
  return allPlaces().find((p) => p.id === id);
}

export async function fetchPlacesByIds(ids: string[]): Promise<Place[]> {
  await sleep(300);
  return allPlaces().filter((p) => ids.includes(p.id));
}
