export const DELETED_PFP: string = "https://i.ibb.co/ym3hVfTD/account.png";

const DEFAULT_RANDOM_PFPS: string[] = [
  "https://i.ibb.co/ZpCbdcB9/Default-Random-Pfp005.jpg",
  "https://i.ibb.co/fYLdvMwV/Default-Random-Pfp004.jpg",
  "https://i.ibb.co/kg9wsxBb/Default-Random-Pfp003.jpg",
  "https://i.ibb.co/b5PgmPF6/Default-Random-Pfp002.jpg",
  "https://i.ibb.co/xS5s1sKR/Default-Random-Pfp001.jpg",
  "https://i.ibb.co/S4chnw6d/Default-Random-Pfp008.jpg",
  "https://i.ibb.co/k2Ps525N/Default-Random-Pfp007.jpg",
  "https://i.ibb.co/W4bL0Gqc/Default-Random-Pfp006.jpg",
];

export function getRandomDefaultPfp(): string {
  const index = Math.floor(Math.random() * DEFAULT_RANDOM_PFPS.length);
  return DEFAULT_RANDOM_PFPS[index];
}
