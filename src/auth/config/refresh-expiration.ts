type RefreshExpiration = { asString: string; asNumber: number };

const refreshExpiration = {
  asString: '7d',
  asNumber: 1000 * 60 * 60 * 24 * 7,
} as const satisfies RefreshExpiration;

export default refreshExpiration;
