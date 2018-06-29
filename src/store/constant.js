export const COIN_KINDS = ['btc', 'etc', 'eth', 'xrp'];
export const EXCHANGES = ['bitthumb', 'coinone', 'upbit'];

export const BITTHUMB_REQUEST_ADDR =
  'https://api.bithumb.com/public/ticker/ALL';
export const BITTHUMB_COIN_MAP = {};

export const COINONE_REQUEST_ADDR =
  'https://api.coinone.co.kr/ticker/?currency=all';
export const COINONE_COIN_MAP = {};

export const UPBIT_COINS = COIN_KINDS.map(
  value => `KRW-${value.toUpperCase()}`
);
export const UPBIT_REQUEST_ADDR = `https://api.upbit.com/v1/ticker?markets=${UPBIT_COINS.toString()}`;

COIN_KINDS.forEach(value => {
  BITTHUMB_COIN_MAP[value] = value.toUpperCase();
  COINONE_COIN_MAP[value] = value;
});
